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
     * @param userId    캐릭터를 생성할 사용자의 고유 ID
     * @return S3에 업로드된 캐릭터 이미지의 URL
     */
    @Transactional
    public String createMultimodalCharacter(MultipartFile userPhoto, Long userId) {
        /*
        =================================================
        1단계: 기본 프롬프트 로드
        =================================================
         */
        log.info("---- 프롬프트 로드 ----");
        String baseStylePrompt = loadPromptFromFile();

        /*
        =================================================
        2단계: GPT-4o 사진 분석
        =================================================
         */
        log.info("---- GPT-4o 사진 분석 ----");
        // 이미지 객체가 비어있는 경우, 이미지 객체 안에 데이터가 없는 경우 예외처리
        if (userPhoto == null || userPhoto.isEmpty()) {throw new OpenAiApiException(ErrorCode.OPENAI_API_IMAGE_DATA_EMPTY);}
        String visualFeatures = analyzePhotoWithGpt4o(userPhoto);
        log.info("추출된 특징: {}", visualFeatures);

        /*
        =================================================
        3단계: DALL-E 3 캐릭터 생성
        =================================================
         */
        // GPT에게 받은 특징 데이터가 없는 경우 예외처리
        if (visualFeatures.isEmpty()){throw new OpenAiApiException(ErrorCode.OPENAI_API_ERROR);}
        String finalPrompt = String.format("%s, based on these visual features: %s", baseStylePrompt, visualFeatures);
        String generatedImageUrl = callOpenAiDallE3(finalPrompt);
        log.info("생성된 이미지 URL: {}", generatedImageUrl);

        /*
        =================================================
        4단계: S3 업로드
        =================================================
         */
        log.info("--- S3에 저장중 ---");
        byte[] imageBytes;
        try {
            java.net.URL url = new java.net.URL(generatedImageUrl);
            try (java.io.InputStream in = url.openStream()) {
                imageBytes = in.readAllBytes();
            }
            // 이미지가 비어있는 경우 에러발생
            if (imageBytes.length == 0) {
                throw new OpenAiApiException(ErrorCode.OPENAI_API_IMAGE_DATA_EMPTY);
            }
        } catch (OpenAiApiException e) {
            throw e;
        } catch (Exception e){
            throw new OpenAiApiException(ErrorCode.OPENAI_API_IMAGE_DOWNLOAD_FAILED);
        }

        String fileName = "characters/" + UUID.randomUUID() + ".png";
        String s3Url;
        try {
            s3Url = s3UploadService.upload(imageBytes, fileName);
            log.info("S3 업로드 성공: {}", s3Url);
        } catch (Exception e) {
            throw new OpenAiApiException(ErrorCode.OPENAI_API_S3_SAVE_FAILED);
        }

        /*
        =================================================
        5단계: DB에 데이터 저장
        =================================================
         */
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new OpenAiApiException(ErrorCode.USER_NOT_FOUND));

        CharacterProfileEntity profile = CharacterProfileEntity.builder()
                .user(user)
                .image(s3Url)
                .build();
        try {
            characterRepository.save(profile);
        } catch (Exception e) {
            // DB에 저장을 실패하는 경우 에러처리
            throw new OpenAiApiException(ErrorCode.OPENAI_API_DB_SAVE_FAILED);
        }
        log.info("DB 기록 성공: userId={}", userId);

        return s3Url; // 성공 시 여기서 즉시 반환
    }

    private String analyzePhotoWithGpt4o(MultipartFile photo) {
        String url = "https://api.openai.com/v1/chat/completions";

        // 이미지 바이트 추출
        byte[] imageBytes;
        try {
            imageBytes = photo.getBytes();
        } catch (IOException e) {
            throw new OpenAiApiException(ErrorCode.OPENAI_API_IMAGE_DATA_EMPTY);
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

        HttpEntity<String> entity = new HttpEntity<>(mapper.writeValueAsString(rootNode), headers);

        // GPT-4o API 호출 및 응답 파싱
        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);
            // 응답 바디가 없는 경우 에러처리
            if (response.getBody() == null) {
                throw new OpenAiApiException(ErrorCode.OPENAI_API_REQUEST_NOT_FOUND_BODY);
            }
            List<Map<String, Object>> choices = (List<Map<String, Object>>) response.getBody().get("choices");
            // 응답 choices가 없거나 비어있는 경우 에러처리
            if (choices == null || choices.isEmpty()) {
                throw new OpenAiApiException(ErrorCode.OPENAI_API_ERROR);
            }
            Map<String, Object> messageBody = (Map<String, Object>) choices.get(0).get("message");
            // 메시지 바디가 없는 경우 에러처리
            if (messageBody == null) {
                throw new OpenAiApiException(ErrorCode.OPENAI_API_ERROR);
            }
            String result = (String) messageBody.get("content");
            // 분석 결과가 없거나 빈 경우 에러처리
            if (result == null || result.isBlank()) {
                throw new OpenAiApiException(ErrorCode.OPENAI_API_ERROR);
            }
            return result;
        } catch (OpenAiApiException e) {
            throw e;
        } catch (Exception e) {
            // GPT-4o API 호출 자체가 실패한 경우 에러처리
            throw new OpenAiApiException(ErrorCode.OPENAI_API_ERROR);
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

        // DALL-E 3 API 호출 및 응답 파싱
        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);
            // 응답 바디가 없는 경우 에러처리
            if (response.getBody() == null) {
                throw new OpenAiApiException(ErrorCode.OPENAI_API_REQUEST_NOT_FOUND_BODY);
            }
            List<Map<String, Object>> data = (List<Map<String, Object>>) response.getBody().get("data");
            // 이미지 데이터가 없거나 비어있는 경우 에러처리
            if (data == null || data.isEmpty()) {
                throw new OpenAiApiException(ErrorCode.OPENAI_API_ERROR);
            }
            String imageUrl = (String) data.get(0).get("url");
            // 이미지 URL이 없거나 빈 경우 에러처리
            if (imageUrl == null || imageUrl.isBlank()) {
                throw new OpenAiApiException(ErrorCode.OPENAI_API_IMAGE_DOWNLOAD_FAILED);
            }
            return imageUrl;
        } catch (OpenAiApiException e) {
            throw e;
        } catch (Exception e) {
            // DALL-E 3 API 호출 자체가 실패한 경우 에러처리
            throw new OpenAiApiException(ErrorCode.OPENAI_API_ERROR);
        }
    }

    private String loadPromptFromFile() {
        Resource resource = resourceLoader.getResource("classpath:prompts/base-prompt");
        // 1. 파일이 없는 경우
        if (!resource.exists()) {
            throw new OpenAiApiException(ErrorCode.OPENAI_API_PROMPT_NOT_FOUND);
        }
        try {
            String content = StreamUtils.copyToString(resource.getInputStream(), StandardCharsets.UTF_8);
            // 2. 파일은 있는데 내용이 없는 경우
            if (content.isBlank()) {
                throw new OpenAiApiException(ErrorCode.OPENAI_API_PROMPT_EMPTY);
            }
            // 성공
            return StreamUtils.copyToString(resource.getInputStream(), StandardCharsets.UTF_8).trim();
        } catch (IOException e) {
            // 3. 읽는 도중에 알수 없는 에러 발생
            throw new OpenAiApiException(ErrorCode.OPENAI_API_ERROR);
        }
    }
}