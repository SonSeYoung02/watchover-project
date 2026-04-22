package com.chh.watchover.domain.calendar.service;

import com.chh.watchover.domain.calendar.model.dto.EmotionStatResponse;
import com.chh.watchover.domain.calendar.model.entity.CalendarLogEntity;
import com.chh.watchover.domain.chatbot.model.entity.ChatRoomEntity;
import com.chh.watchover.domain.chatbot.model.entity.MessageEntity;
import com.chh.watchover.domain.calendar.model.type.EmotionType;
import com.chh.watchover.domain.calendar.repository.CalendarLogRepository;
import com.chh.watchover.domain.chatbot.repository.ChatRoomRepository;
import com.chh.watchover.domain.chatbot.repository.MessageRepository;
import com.chh.watchover.domain.user.model.entity.UserEntity;
import com.chh.watchover.domain.user.repository.UserRepository;
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

@Service
@RequiredArgsConstructor
public class AnalysisService {

    @Value("${OPENAI_API_KEY}")
    private String apiKey;

    private final UserRepository userRepository;
    private final MessageRepository messageRepository;
    private final ChatRoomRepository chatRoomRepository;
    private final CalendarLogRepository calendarLogRepository;
    private final RestTemplate restTemplate = new RestTemplate();

    /**
     * 채팅방의 대화 내역을 OpenAI GPT-4o로 분석하여 사용자의 주된 감정을 추출하고 캘린더 로그에 저장합니다.
     *
     * @param chatRoomId 분석할 채팅방의 고유 ID
     * @return OpenAI가 분석한 감정 문자열 (예: "기쁨", "슬픔", "화남", "혐오")
     * @throws RuntimeException 채팅방이 존재하지 않는 경우
     */
    @Transactional
    public String analyzeAndSaveToCalendar(Long chatRoomId) {
        // 1. 채팅방 및 대화 내역 가져오기
        ChatRoomEntity chatRoom = chatRoomRepository.findById(chatRoomId)
                .orElseThrow(() -> new RuntimeException("채팅방을 찾을 수 없습니다."));

        List<MessageEntity> history = messageRepository.findByChatRoomChatRoomIdOrderByCreatedAtAsc(chatRoomId);

        if (history.isEmpty()) {
            return "분석할 대화 내용이 없습니다.";
        }

        // 2. 대화 내용을 문자열로 병합
        StringBuilder conversation = new StringBuilder();
        for (MessageEntity msg : history) {
            conversation.append(msg.getRole().name()).append(": ").append(msg.getContent()).append("\n");
        }

        // 3. OpenAI 분석 요청 (프롬프트 구성)
        String systemPrompt = "당신은 사용자의 대화를 분석하여 감정을 추출하는 전문가입니다.";
        String userPrompt = "다음 대화 내역을 보고 사용자의 주된 감정을 딱 하나만 골라주세요.\n" +
                "조건: 반드시 '기쁨', '슬픔', '화남', '혐오' 중 하나의 단어로만 대답하세요. 다른 설명은 절대 하지 마세요.\n\n" +
                "대화 내용:\n" + conversation.toString();

        // 4. API 호출 설정
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);

        List<Map<String, String>> messages = new ArrayList<>();
        messages.add(Map.of("role", "system", "content", systemPrompt));
        messages.add(Map.of("role", "user", "content", userPrompt));

        Map<String, Object> requestBody = Map.of(
                "model", "gpt-4o",
                "messages", messages,
                "temperature", 0.3 // 일관된 답변을 위해 온도를 낮게 설정
        );

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        // 5. OpenAI API 호출 및 결과 파싱
        ResponseEntity<Map> response = restTemplate.postForEntity(
                "https://api.openai.com/v1/chat/completions", entity, Map.class);

        List<Map<String, Object>> choices = (List<Map<String, Object>>) response.getBody().get("choices");
        Map<String, Object> messageMap = (Map<String, Object>) choices.get(0).get("message");
        String analyzedEmotion = ((String) messageMap.get("content")).trim();

        // 6. 결과 저장 (calendar_log 테이블 구조에 맞춤)
        CalendarLogEntity calendarLog = new CalendarLogEntity();
        calendarLog.setUser(chatRoom.getUser()); // ChatRoom에 저장된 userId 활용

        try {
            // AI 응답이 Enum에 정의된 값인지 확인 후 저장
            calendarLog.setEmotion(EmotionType.valueOf(analyzedEmotion));
        } catch (IllegalArgumentException e) {
            // 만약 AI가 '기쁨' 대신 '기뻐요' 등으로 답할 경우를 대비해 기본값 처리 또는 로그 기록
            System.err.println("잘못된 감정 값이 반환되었습니다: " + analyzedEmotion);
            calendarLog.setEmotion(EmotionType.슬픔); // 기본값 설정
        }

        calendarLog.setCreatedAt(LocalDateTime.now());
        calendarLogRepository.save(calendarLog);

        return analyzedEmotion;
    }

    /**
     * 특정 사용자의 월별 감정 통계를 조회합니다.
     *
     * @param loginId 조회할 사용자의 로그인 아이디
     * @param year    조회할 연도
     * @param month   조회할 월 (1~12)
     * @return 해당 월의 감정별 통계 정보 목록
     * @throws RuntimeException 해당 로그인 아이디의 사용자가 존재하지 않는 경우
     */
    @Transactional(readOnly = true)
    public List<EmotionStatResponse> getMonthlyEmotionStats(String loginId, int year, int month) {
        // 1. 넘겨받은 식별자로 유저 엔티티 조회
        UserEntity user = userRepository.findByLoginId(loginId) // 혹은 findByEmail 등 실제 ID 필드에 맞춰 사용
                .orElseThrow(() -> new RuntimeException("해당 유저를 찾을 수 없습니다."));

        // 2. 조회된 유저 객체로 레포지토리 호출
        return calendarLogRepository.getMonthlyStats(user, year, month);
    }
}
