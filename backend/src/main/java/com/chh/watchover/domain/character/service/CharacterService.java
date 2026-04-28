package com.chh.watchover.domain.character.service;

import com.chh.watchover.domain.character.model.entity.CharacterProfileEntity;
import com.chh.watchover.domain.character.repository.CharacterProfileRepository;
import com.chh.watchover.domain.user.model.entity.UserEntity;
import com.chh.watchover.domain.user.repository.UserRepository; // 유저 레포지토리 필요
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
    private final UserRepository userRepository; // 유저 조회를 위해 추가

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper mapper = new ObjectMapper();

    /**
     * 사용자 사진을 분석하여 2D 캐릭터 이미지를 생성하고 S3에 업로드한 뒤 DB에 저장합니다.
     * GPT-4o로 사진의 시각적 특징을 추출하고, DALL-E 3로 캐릭터 이미지를 생성합니다.
     *
     * @param userPhoto 캐릭터 생성에 사용할 사용자 사진 파일
     * @param loginId   인증 토큰에서 추출한 사용자 loginId
     * @return S3에 업로드된 캐릭터 이미지의 URL
     */
    @Transactional
    public String createMultimodalCharacter(MultipartFile userPhoto, String loginId) {
        // 0단계: 사용자 식별 (Principal 기반)
        UserEntity user = userRepository.findByLoginId(loginId)
                .orElseThrow(() -> {
                    log.warn("[Character] 사용자 미존재 loginId={}", loginId);
                    return new OpenAiApiException(ErrorCode.USER_NOT_FOUND);
                });
        log.info("[Character] 캐릭터 생성 시작 userId={}, loginId={}", user.getUserId(), loginId);

        // 1단계: 입력 이미지 검증
        if (userPhoto == null || userPhoto.isEmpty()) {
            log.warn("[Character] 업로드 이미지 비어있음");
            throw new OpenAiApiException(ErrorCode.OPENAI_API_IMAGE_DATA_EMPTY);
        }

        // 2단계: 기본 프롬프트 로드
        String baseStylePrompt = loadPromptFromFile();
        log.info("[Character] 프롬프트 로드 완료 length={}", baseStylePrompt.length());

        // 3단계: GPT-4o 사진 분석
        String visualFeatures = analyzePhotoWithGpt4o(userPhoto);
        if (visualFeatures.isBlank()) {
            log.error("[Character] GPT-4o 응답이 비어있음");
            throw new OpenAiApiException(ErrorCode.OPENAI_API_CONTENT_EMPTY);
        }
        log.info("[Character] 시각 특징 추출 완료: {}", visualFeatures);

        // 4단계: DALL-E 3 캐릭터 생성
        String finalPrompt = String.format("%s, based on these visual features: %s", baseStylePrompt, visualFeatures);
        String generatedImageUrl = callOpenAiDallE3(finalPrompt);
        log.info("[Character] DALL-E 3 이미지 URL 수신: {}", generatedImageUrl);

        // 5단계: 생성 이미지 다운로드
        byte[] imageBytes = downloadImage(generatedImageUrl);

        // 6단계: S3 업로드
        String fileName = "characters/" + UUID.randomUUID() + ".png";
        String s3Url;
        try {
            s3Url = s3UploadService.upload(imageBytes, fileName);
            log.info("[Character] S3 업로드 성공 url={}", s3Url);
        } catch (Exception e) {
            log.error("[Character] S3 업로드 실패 fileName={}", fileName, e);
            throw new OpenAiApiException(ErrorCode.OPENAI_API_S3_SAVE_FAILED);
        }

        // 7단계: DB 저장
        CharacterProfileEntity profile = CharacterProfileEntity.builder()
                .user(user)
                .image(s3Url)
                .build();
        try {
            characterRepository.save(profile);
        } catch (Exception e) {
            log.error("[Character] DB 저장 실패 userId={}", user.getUserId(), e);
            throw new OpenAiApiException(ErrorCode.OPENAI_API_DB_SAVE_FAILED);
        }
        log.info("[Character] DB 기록 성공 userId={}", user.getUserId());

        return s3Url;
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

    private byte[] downloadImage(String imageUrl) {
        try {
            java.net.URL url = new java.net.URL(imageUrl);
            try (java.io.InputStream in = url.openStream()) {
                byte[] bytes = in.readAllBytes();
                if (bytes.length == 0) {
                    log.error("[Character] 이미지 다운로드 결과 0바이트 url={}", imageUrl);
                    throw new OpenAiApiException(ErrorCode.OPENAI_API_IMAGE_DATA_EMPTY);
                }
                return bytes;
            }
        } catch (OpenAiApiException e) {
            throw e;
        } catch (Exception e) {
            log.error("[Character] 이미지 다운로드 실패 url={}", imageUrl, e);
            throw new OpenAiApiException(ErrorCode.OPENAI_API_IMAGE_DOWNLOAD_FAILED);
        }
    }

    private String analyzePhotoWithGpt4o(MultipartFile photo) {
        String url = "https://api.openai.com/v1/chat/completions";

        byte[] imageBytes;
        try {
            imageBytes = photo.getBytes();
        } catch (IOException e) {
            log.error("[Character] MultipartFile.getBytes 실패", e);
            throw new OpenAiApiException(ErrorCode.OPENAI_API_IMAGE_PARSE_FAILED);
        }
        if (imageBytes.length == 0) {
            throw new OpenAiApiException(ErrorCode.OPENAI_API_IMAGE_DATA_EMPTY);
        }

        String base64Image = Base64.getEncoder().encodeToString(imageBytes).replaceAll("\\s", "");

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);

        ObjectNode rootNode = mapper.createObjectNode();
        rootNode.put("model", "gpt-4o");

        ObjectNode message = mapper.createObjectNode();
        message.put("role", "user");
        ArrayNode content = mapper.createArrayNode();

        ObjectNode textObj = mapper.createObjectNode();
        textObj.put("type", "text");
        textObj.put("text", "Extract 3-5 design keywords for a 2D character. Focus on colors and outfit.");
        content.add(textObj);

        ObjectNode imageObj = mapper.createObjectNode();
        imageObj.put("type", "image_url");
        ObjectNode urlObj = mapper.createObjectNode();
        urlObj.put("url", "data:image/jpeg;base64," + base64Image);
        imageObj.set("image_url", urlObj);
        content.add(imageObj);

        message.set("content", content);
        rootNode.set("messages", mapper.createArrayNode().add(message));

        String requestJson;
        try {
            requestJson = mapper.writeValueAsString(rootNode);
        } catch (Exception e) {
            log.error("[Character] GPT-4o 요청 JSON 직렬화 실패", e);
            throw new OpenAiApiException(ErrorCode.OPENAI_API_REQUEST_BUILD_FAILED);
        }
        HttpEntity<String> entity = new HttpEntity<>(requestJson, headers);

        ResponseEntity<Map> response;
        try {
            response = restTemplate.postForEntity(url, entity, Map.class);
        } catch (Exception e) {
            log.error("[Character] GPT-4o API 호출 실패", e);
            throw new OpenAiApiException(ErrorCode.OPENAI_API_GPT_CALL_FAILED);
        }

        try {
            if (response.getBody() == null) {
                throw new OpenAiApiException(ErrorCode.OPENAI_API_REQUEST_NOT_FOUND_BODY);
            }
            List<Map<String, Object>> choices = (List<Map<String, Object>>) response.getBody().get("choices");
            if (choices == null || choices.isEmpty()) {
                throw new OpenAiApiException(ErrorCode.OPENAI_API_CHOICES_EMPTY);
            }
            Map<String, Object> messageBody = (Map<String, Object>) choices.get(0).get("message");
            if (messageBody == null) {
                throw new OpenAiApiException(ErrorCode.OPENAI_API_MESSAGE_NOT_FOUND);
            }
            String result = (String) messageBody.get("content");
            if (result == null || result.isBlank()) {
                throw new OpenAiApiException(ErrorCode.OPENAI_API_CONTENT_EMPTY);
            }
            return result;
        } catch (OpenAiApiException e) {
            throw e;
        } catch (Exception e) {
            log.error("[Character] GPT-4o 응답 파싱 실패 body={}", response.getBody(), e);
            throw new OpenAiApiException(ErrorCode.OPENAI_API_RESPONSE_PARSE_FAILED);
        }
    }

    private String callOpenAiDallE3(String prompt) {
        String url = "https://api.openai.com/v1/images/generations";
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);

        Map<String, Object> body = new HashMap<>();
        body.put("model", "dall-e-3");
        body.put("prompt", prompt);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

        ResponseEntity<Map> response;
        try {
            response = restTemplate.postForEntity(url, entity, Map.class);
        } catch (Exception e) {
            log.error("[Character] DALL-E 3 API 호출 실패", e);
            throw new OpenAiApiException(ErrorCode.OPENAI_API_DALLE_CALL_FAILED);
        }

        try {
            if (response.getBody() == null) {
                throw new OpenAiApiException(ErrorCode.OPENAI_API_REQUEST_NOT_FOUND_BODY);
            }
            List<Map<String, Object>> data = (List<Map<String, Object>>) response.getBody().get("data");
            if (data == null || data.isEmpty()) {
                throw new OpenAiApiException(ErrorCode.OPENAI_API_RESPONSE_PARSE_FAILED);
            }
            String imageUrl = (String) data.get(0).get("url");
            if (imageUrl == null || imageUrl.isBlank()) {
                throw new OpenAiApiException(ErrorCode.OPENAI_API_IMAGE_DOWNLOAD_FAILED);
            }
            return imageUrl;
        } catch (OpenAiApiException e) {
            throw e;
        } catch (Exception e) {
            log.error("[Character] DALL-E 3 응답 파싱 실패 body={}", response.getBody(), e);
            throw new OpenAiApiException(ErrorCode.OPENAI_API_RESPONSE_PARSE_FAILED);
        }
    }

    private String loadPromptFromFile() {
        Resource resource = resourceLoader.getResource("classpath:prompts/base-prompt.md");
        if (!resource.exists()) {
            log.error("[Character] 프롬프트 리소스를 찾을 수 없음 path=classpath:prompts/base-prompt");
            throw new OpenAiApiException(ErrorCode.OPENAI_API_PROMPT_NOT_FOUND);
        }
        try {
            String content = StreamUtils.copyToString(resource.getInputStream(), StandardCharsets.UTF_8).trim();
            if (content.isBlank()) {
                throw new OpenAiApiException(ErrorCode.OPENAI_API_PROMPT_EMPTY);
            }
            return content;
        } catch (OpenAiApiException e) {
            throw e;
        } catch (IOException e) {
            log.error("[Character] 프롬프트 파일 읽기 실패", e);
            throw new OpenAiApiException(ErrorCode.OPENAI_API_ERROR);
        }
    }
}
