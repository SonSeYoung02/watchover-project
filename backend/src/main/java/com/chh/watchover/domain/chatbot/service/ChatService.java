package com.chh.watchover.domain.chatbot.service;

import com.chh.watchover.domain.user.repository.UserRepository;
import com.chh.watchover.global.exception.CustomException;
import com.chh.watchover.global.exception.code.ErrorCode;
import com.chh.watchover.domain.chatbot.model.dto.ChatResponse;
import com.chh.watchover.domain.chatbot.model.dto.ChatRoomListResponse;
import com.chh.watchover.domain.chatbot.model.entity.ChatRoomEntity;
import com.chh.watchover.domain.chatbot.model.entity.MessageEntity;
import com.chh.watchover.domain.chatbot.model.type.Role;
import com.chh.watchover.domain.chatbot.repository.ChatRoomRepository;
import com.chh.watchover.domain.chatbot.repository.MessageRepository;
import com.chh.watchover.domain.chatbot.util.PromptReader;
import com.chh.watchover.domain.user.model.entity.UserEntity;
import org.springframework.transaction.annotation.Transactional;
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
import java.util.stream.Collectors;

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

    /**
     * 사용자의 메시지를 OpenAI GPT-4o에 전달하고 응답을 받아 대화 내역을 DB에 저장합니다.
     * 채팅방이 존재하지 않으면 자동으로 생성합니다.
     *
     * @param loginId     요청하는 사용자의 로그인 아이디
     * @param chatRoomId  대화를 진행할 채팅방의 고유 ID (없으면 자동 생성)
     * @param promptFile  사용할 시스템 프롬프트 파일명
     * @param userMessage 사용자가 입력한 메시지
     * @return 채팅방 ID와 AI 응답 내용을 담은 ChatResponse
     * @throws RuntimeException 해당 로그인 아이디의 사용자가 존재하지 않는 경우
     */
    @Transactional
    public ChatResponse getChatResponse(String loginId, Long chatRoomId, String promptFile, String userMessage) {
        UserEntity user = userRepository.findByLoginId(loginId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        // 1. 채팅방 존재 확인 및 없으면 자동 생성
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
        String gptAnswer = stripSpeakerPrefix((String) messageMap.get("content"));

        // 6. DB에 대화 내역 저장
        saveMessage(chatRoom, Role.user, userMessage); // 사용자 질문 저장
        saveMessage(chatRoom, Role.assistant, gptAnswer);    // AI 응답 저장

        //Role 필드 추가(필요 시)

        // 7. 결과 반환 (ChatResponse DTO 및 Builder 사용) ✅
        return ChatResponse.builder()
                .chatRoomId(chatRoom.getChatRoomId()) // DB에서 생성/조회된 방 ID 세팅
                .answer(gptAnswer)                   // GPT 답변 세팅
                .build();

    }

    /**
     * 특정 채팅방의 대화 내역을 시간순으로 조회합니다.
     *
     * @param chatRoomId 조회할 채팅방의 고유 ID
     * @return 시간순으로 정렬된 대화 메시지 목록
     */
    @Transactional(readOnly = true) // 단순 조회이므로 readOnly를 붙여주면 성능상 이득이 있습니다.
    public List<ChatResponse> getChatHistory(Long chatRoomId) {
        // 1. 해당 방의 모든 메시지를 시간순으로 조회
        List<MessageEntity> messages = messageRepository.findByChatRoomChatRoomIdOrderByCreatedAtAsc(chatRoomId);

        // 2. MessageEntity 리스트를 ChatResponse 리스트로 변환
        return messages.stream()
                .map(msg -> ChatResponse.builder()
                        .chatRoomId(chatRoomId)
                        .answer(stripSpeakerPrefix(msg.getContent())) // DB에 저장된 메시지 내용
                        .build())
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ChatRoomListResponse> getChatRoomList(String loginId) {
        return chatRoomRepository.findByUser_LoginIdOrderByCreatedAtDesc(loginId)
                .stream()
                .map(room -> ChatRoomListResponse.builder()
                        .chatRoomId(room.getChatRoomId())
                        .createdAt(room.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
    }

    private void saveMessage(ChatRoomEntity chatRoom, Role role, String content) {
        MessageEntity message = new MessageEntity();
        message.setChatRoom(chatRoom);
        message.setRole(role);
        message.setContent(content);
        message.setCreatedAt(LocalDateTime.now());
        messageRepository.save(message);
    }

    private String stripSpeakerPrefix(String content) {
        if (content == null) {
            return null;
        }

        return content.replaceFirst("^\\s*(챗봇|AI|상담사)\\s*[:：]\\s*", "");
    }
}
