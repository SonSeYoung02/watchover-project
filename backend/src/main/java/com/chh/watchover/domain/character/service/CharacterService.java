package com.chh.watchover.domain.character.service;

import com.chh.watchover.domain.character.model.entity.CharacterProfileEntity;
import com.chh.watchover.domain.character.repository.CharacterProfileRepository;
import com.chh.watchover.domain.user.model.entity.UserEntity;
import com.chh.watchover.domain.user.repository.UserRepository; // 유저 레포지토리 필요
import com.chh.watchover.domain.user.model.type.Gender;
import com.chh.watchover.global.exception.OpenAiApiException;
import com.chh.watchover.global.exception.code.ErrorCode;
import com.chh.watchover.global.service.S3UploadService; // S3 서비스 패키지 경로 확인 필요
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StreamUtils;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.resource.ResourceResolver;
import tools.jackson.databind.ObjectMapper;
import tools.jackson.databind.node.ArrayNode;
import tools.jackson.databind.node.ObjectNode;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class CharacterService {

    @Value("${OPENAI_API_KEY}")
    private String apiKey;

    private final ResourceLoader resourceLoader;
    private final S3UploadService s3UploadService;
    private final CharacterProfileRepository characterRepository;
    private final UserRepository userRepository;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper mapper = new ObjectMapper();

    @Transactional
    public String createMultimodalCharacter(MultipartFile userPhoto, String loginId) {
        // 0. 사용자 조회 및 사진 검증
        UserEntity user = userRepository.findByLoginId(loginId)
                .orElseThrow(() -> new OpenAiApiException(ErrorCode.USER_NOT_FOUND));

        if (userPhoto == null || userPhoto.isEmpty()) {
            throw new OpenAiApiException(ErrorCode.OPENAI_API_IMAGE_DATA_EMPTY);
        }

        // 1. GPT-4o mini를 사용하여 사진 분석 (extract-features.md 적용)
        // 성별 정보를 프롬프트에 포함하여 분석의 정확도를 높입니다.
        String genderContext = buildGenderContext(user);
        String extractedKeywords = analyzePhotoWithGpt4oMini(userPhoto, genderContext);

        // 안전 장치 보강: SAFETY_ERROR나 검열 관련 문구가 포함된 경우
        if (extractedKeywords.toUpperCase().contains("SAFETY") || extractedKeywords.contains("sorry")) {
            log.warn("[Character] 분석 결과에 안전 이슈 감지. 기본 키워드로 대체합니다.");
            extractedKeywords = "casual outfit, simple hairstyle, friendly expression";
        }
        // 2. GPT Image 1.5를 위한 최종 프롬프트 빌드 (base-style.md 적용)
        String finalImagePrompt = buildFinalImagePrompt(extractedKeywords, user);
        log.info("[Character] 최종 생성 프롬프트: {}", finalImagePrompt);

        // 3. GPT Image 1.5 API 호출하여 이미지 생성
        Map<String, Object> gptResponse = callGptImage15(finalImagePrompt);
        log.info("[Character] GPT Image 1.5 응답 수신 완료");

        // 4단계: 응답에서 Base64 이미지 데이터 추출 및 S3 업로드
        return processAndSaveBase64Image(gptResponse, user);
    }

    /**
     * 1단계: GPT-4o mini를 이용한 이미지 특징 추출
     */
    private String analyzePhotoWithGpt4oMini(MultipartFile photo, String genderContext) {
        String url = "https://api.openai.com/v1/chat/completions";
        String systemGuide = loadPromptResource("extract-features.md");

        // base64 인코딩
        String base64Image = encodeImageToBase64(photo);

        ObjectNode rootNode = mapper.createObjectNode();
        rootNode.put("model", "gpt-4o-mini");

        ArrayNode messages = mapper.createArrayNode();

        // System: 분석 가이드 제공
        messages.add(mapper.createObjectNode()
                .put("role", "system")
                .put("content", systemGuide));

        // User: 이미지와 성별 컨텍스트 전달
        ObjectNode userMessage = mapper.createObjectNode().put("role", "user");
        ArrayNode content = mapper.createArrayNode();
        content.add(mapper.createObjectNode().put("type", "text")
                .put("text", "Follow the system guidelines to scout design resources from this image. " + genderContext));

        ObjectNode imageObj = mapper.createObjectNode().put("type", "image_url");
        imageObj.set("image_url", mapper.createObjectNode()
                .put("url", "data:image/jpeg;base64," + base64Image)
                .put("detail", "low")); // 비용 및 속도 최적화
        content.add(imageObj);

        userMessage.set("content", content);
        messages.add(userMessage);
        rootNode.set("messages", messages);

        return fetchContentFromResponse(url, rootNode);
    }

    /**
     * 2단계: GPT Image 1.5 (DALL-E 3 후속) 호출
     */
    private Map<String, Object> callGptImage15(String finalPrompt) {
        String url = "https://api.openai.com/v1/images/generations";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);

        ObjectNode rootNode = mapper.createObjectNode();
        rootNode.put("model", "gpt-image-1.5");
        rootNode.put("prompt", finalPrompt);
        rootNode.put("n", 1);
        rootNode.put("size", "1024x1024");
        rootNode.put("quality", "low");

        HttpEntity<String> entity = new HttpEntity<>(rootNode.toString(), headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);
            return response.getBody();
        } catch (Exception e) {
            log.error("[Character] 이미지 생성 API 호출 중 오류 발생: {}", e.getMessage());
            throw new OpenAiApiException(ErrorCode.OPENAI_API_DALLE_CALL_FAILED);
        }
    }

    private String buildFinalImagePrompt(String features, UserEntity user) {
        String styleTemplate = loadPromptResource("base-style.md");
        String genderText = (user.getGender() == Gender.M) ? "boy" : "girl";

        // base-style.md 내의 플레이스홀더를 실제 데이터로 치환
        return styleTemplate
                .replace("[GENDER_INFO]", genderText)
                .replace("[EXTRACTED_KEYWORDS]", features);
    }

    // --- 헬퍼 메소드들 ---

    private String fetchContentFromResponse(String url, ObjectNode requestBody) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);

        HttpEntity<String> entity = new HttpEntity<>(requestBody.toString(), headers);
        ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);

        Map<String, Object> choice = ((List<Map<String, Object>>) response.getBody().get("choices")).get(0);
        Map<String, Object> message = (Map<String, Object>) choice.get("message");
        return (String) message.get("content");
    }

    private String encodeImageToBase64(MultipartFile photo) {
        try {
            return Base64.getEncoder().encodeToString(photo.getBytes());
        } catch (IOException e) {
            throw new OpenAiApiException(ErrorCode.OPENAI_API_IMAGE_PARSE_FAILED);
        }
    }

    private String loadPromptResource(String fileName) {
        Resource resource = resourceLoader.getResource("classpath:prompts/" + fileName);
        try {
            return StreamUtils.copyToString(resource.getInputStream(), StandardCharsets.UTF_8);
        } catch (IOException e) {
            log.error("[Character] 프롬프트 파일 로드 실패: {}", fileName);
            return "";
        }
    }

    private String processAndSaveBase64Image(Map<String, Object> responseBody, UserEntity user) {
        try {
            // Base64 문자열 추출
            List<Map<String, Object>> dataList = (List<Map<String, Object>>) responseBody.get("data");
            String base64Image = (String) dataList.get(0).get("b64_json");

            if (base64Image == null || base64Image.isBlank()) {
                throw new OpenAiApiException(ErrorCode.OPENAI_API_CONTENT_EMPTY);
            }

            // ✅ Base64 디코딩 (이제 downloadImage가 필요 없습니다!)
            byte[] imageBytes = Base64.getDecoder().decode(base64Image);

            // S3 업로드 및 DB 저장 로직 (기존 downloadImage 이후 로직과 동일)
            String fileName = "characters/" + UUID.randomUUID() + ".png";
            String s3Url = s3UploadService.upload(imageBytes, fileName);

            characterRepository.save(CharacterProfileEntity.builder()
                    .user(user)
                    .image(s3Url)
                    .build());
            return s3Url;

        } catch (Exception e) {
            log.error("[Character] 이미지 디코딩 및 S3 업로드 실패", e);
            throw new OpenAiApiException(ErrorCode.OPENAI_API_RESPONSE_PARSE_FAILED);
        }
    }

    private String buildGenderContext(UserEntity user) {
        return "The user's gender is " + (user.getGender() == Gender.M ? "Male" : "Female") + ".";
    }


    @Transactional(readOnly = true)
    public List<String> getCharacterImages(String loginId) {
        UserEntity user = userRepository.findByLoginId(loginId)
                .orElseThrow(() -> new OpenAiApiException(ErrorCode.USER_NOT_FOUND));

        return characterRepository.findAllByUserUserIdOrderByIdDesc(user.getUserId()).stream()
                .map(CharacterProfileEntity::getImage)
                .filter(Objects::nonNull)
                .distinct()
                .collect(Collectors.toList());
    }

    @Transactional
    public String selectCharacterImage(String loginId, String imageUrl) {
        if (imageUrl == null || imageUrl.isBlank()) {
            throw new OpenAiApiException(ErrorCode.OPENAI_API_IMAGE_DATA_EMPTY);
        }

        UserEntity user = userRepository.findByLoginId(loginId)
                .orElseThrow(() -> new OpenAiApiException(ErrorCode.USER_NOT_FOUND));

        boolean belongsToUser = characterRepository.findAllByUserUserIdOrderByIdDesc(user.getUserId()).stream()
                .map(CharacterProfileEntity::getImage)
                .anyMatch(imageUrl::equals);

        if (!belongsToUser) {
            throw new OpenAiApiException(ErrorCode.CHARACTER_NOT_FOUND);
        }

        CharacterProfileEntity selectedProfile = CharacterProfileEntity.builder()
                .user(user)
                .image(imageUrl)
                .build();
        characterRepository.save(selectedProfile);
        return imageUrl;
    }

}

