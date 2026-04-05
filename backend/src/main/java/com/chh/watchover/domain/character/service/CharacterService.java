package com.chh.watchover.domain.character.service;

import com.chh.watchover.domain.character.model.entity.CharacterProfileEntity;
import com.chh.watchover.domain.character.repository.CharacterProfileRepository;
import com.chh.watchover.domain.user.model.entity.UserEntity;
import com.chh.watchover.domain.user.repository.UserRepository; // 유저 레포지토리 필요
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

    @Transactional
    public String createMultimodalCharacter(MultipartFile userPhoto, Long userId) throws IOException {
        // 0. 기본 프롬프트 로드
        String baseStylePrompt = loadPromptFromFile();

        // 1단계: GPT-4o 사진 분석
        String visualFeatures = analyzePhotoWithGpt4o(userPhoto);
        log.info("추출된 특징: {}", visualFeatures);

        // 2단계: DALL-E 3 캐릭터 생성
        String finalPrompt = String.format("%s, based on these visual features: %s", baseStylePrompt, visualFeatures);
        String generatedImageUrl = callOpenAiDallE3(finalPrompt);
        log.info("생성된 이미지 URL: {}", generatedImageUrl);

        // 3단계: S3 업로드 및 DB 저장
        log.info("--- 3단계: 이미지 저장 프로세스 시작 ---");

        try {
            // [핵심] RestTemplate의 헤더 간섭을 피하기 위해 java.net.URL 사용
            java.net.URL url = new java.net.URL(generatedImageUrl);
            byte[] imageBytes;

            try (java.io.InputStream in = url.openStream()) {
                imageBytes = in.readAllBytes();
            }

            if (imageBytes == null || imageBytes.length == 0) {
                throw new RuntimeException("이미지 데이터를 읽어오지 못했습니다.");
            }

            // S3 업로드
            String fileName = "characters/" + UUID.randomUUID() + ".png";
            String s3Url = s3UploadService.upload(imageBytes, fileName);
            log.info("S3 업로드 성공: {}", s3Url);

            // 4단계: DB 저장
            UserEntity user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

            CharacterProfileEntity profile = CharacterProfileEntity.builder()
                    .user(user)
                    .image(s3Url)
                    .build();

            characterRepository.save(profile);
            log.info("DB 기록 성공: userId={}", userId);

            return s3Url; // 성공 시 여기서 즉시 반환

        } catch (Exception e) {
            log.error("이미지 처리 중 상세 에러: {}", e.getMessage());
            // 예외 발생 시 트랜잭션 롤백을 위해 RuntimeException 던짐
            throw new RuntimeException("캐릭터 저장 중 오류 발생: " + e.getMessage());
        }
    }
    private String analyzePhotoWithGpt4o(MultipartFile photo) throws IOException {
        String url = "https://api.openai.com/v1/chat/completions";
        byte[] imageBytes = photo.getBytes();
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
        ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);
        List<Map<String, Object>> choices = (List<Map<String, Object>>) response.getBody().get("choices");
        return (String) ((Map<String, Object>) choices.get(0).get("message")).get("content");
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
        ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);
        List<Map<String, Object>> data = (List<Map<String, Object>>) response.getBody().get("data");
        return (String) data.get(0).get("url");
    }

    private String loadPromptFromFile() throws IOException {
        Resource resource = resourceLoader.getResource("classpath:prompts/base-prompt");
        if (!resource.exists()) return "A 2D character design";
        return StreamUtils.copyToString(resource.getInputStream(), StandardCharsets.UTF_8).trim();
    }
}