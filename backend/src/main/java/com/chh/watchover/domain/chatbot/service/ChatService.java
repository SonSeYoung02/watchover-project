package com.chh.watchover.domain.chatbot.service;

import com.chh.watchover.domain.user.repository.UserRepository;
import com.chh.watchover.domain.chatbot.model.dto.ChatResponse;
import com.chh.watchover.domain.chatbot.model.entity.ChatRoomEntity;
import com.chh.watchover.domain.chatbot.model.entity.MessageEntity;
import com.chh.watchover.domain.chatbot.model.type.Role;
import com.chh.watchover.domain.chatbot.repository.ChatRoomRepository;
import com.chh.watchover.domain.chatbot.repository.MessageRepository;
import com.chh.watchover.domain.chatbot.util.PromptReader;
import com.chh.watchover.domain.user.model.entity.UserEntity;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor // Lombok을 사용하면 생성자 주입이 자동으로 처리됩니다.
public class ChatService {

    @Value("${OPENAI_API_KEY}")
    private String apiKey;

    private final UserRepository userRepository;
    private final PromptReader promptReader;
    private final MessageRepository messageRepository; // 추가
    private final ChatRoomRepository chatRoomRepository; // 추가
    private final RestTemplate restTemplate = new RestTemplate();

    @Transactional
    public ChatResponse getChatResponse(Long userId, Long chatRoomId, String promptFile, String userMessage) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("유저를 찾을 수 없습니다."));

        // 2. 채팅방 존재 확인 및 없으면 자동 생성
        ChatRoomEntity chatRoom = chatRoomRepository.findById(chatRoomId)
                .orElseGet(() -> {
                    // 수정된 create 메서드에 user 객체를 전달 ✅
                    ChatRoomEntity newRoom = ChatRoomEntity.create(user);
                    return chatRoomRepository.save(newRoom);
                });

        // 2. 시스템 프롬프트 및 이전 대화 내역 불러오기
        String systemContent = promptReader.readPrompt(promptFile);
        List<MessageEntity> history = messageRepository.findByChatRoomChatRoomIdOrderByCreatedAtAsc(chatRoomId);

        // 3. OpenAI 메시지 리스트 구성
        List<Map<String, String>> messages = new ArrayList<>();

        // 페르소나 설정 (System)
        messages.add(Map.of("role", "system", "content", systemContent));

        // 과거 내역 추가 (DB 저장된 값들)
        for (MessageEntity msg : history) {
            messages.add(Map.of("role", msg.getRole().name(), "content", msg.getContent()));
        }

        // 현재 사용자 메시지 추가 (User)
        messages.add(Map.of("role", "user", "content", userMessage));

        // 4. API 호출 설정
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);

        Map<String, Object> requestBody = Map.of(
                "model", "gpt-4o", // 최신 모델로 설정하셨네요!
                "messages", messages
        );

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        // 5. OpenAI API 호출
        ResponseEntity<Map> response = restTemplate.postForEntity(
                "https://api.openai.com/v1/chat/completions", entity, Map.class);

        // 응답 데이터 파싱
        List<Map<String, Object>> choices = (List<Map<String, Object>>) response.getBody().get("choices");
        Map<String, Object> messageMap = (Map<String, Object>) choices.get(0).get("message");
        String gptAnswer = (String) messageMap.get("content");

        // 6. DB에 대화 내역 저장
        saveMessage(chatRoom, Role.user, userMessage); // 사용자 질문 저장
        saveMessage(chatRoom, Role.assistant, gptAnswer);    // AI 응답 저장

        // 7. 결과 반환 (ChatResponse DTO 사용) ✅
        ChatResponse chatResponse = new ChatResponse();
        chatResponse.setAnswer(gptAnswer);
        // 프론트가 다음 대화 때 이 방 ID를 쓸 수 있게 넣어줍니다.
        // 만약 방금 생성되었다면 생성된 ID가 나갑니다.
        return chatResponse;
    }

    private void saveMessage(ChatRoomEntity chatRoom, Role role, String content) {
        MessageEntity message = new MessageEntity();
        message.setChatRoom(chatRoom);
        message.setRole(role);
        message.setContent(content);
        message.setCreatedAt(LocalDateTime.now());
        messageRepository.save(message);
    }
}