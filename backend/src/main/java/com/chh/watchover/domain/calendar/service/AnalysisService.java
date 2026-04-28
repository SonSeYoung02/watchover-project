package com.chh.watchover.domain.calendar.service;

import com.chh.watchover.domain.calendar.model.dto.EmotionLogResponse;
import com.chh.watchover.domain.calendar.model.dto.EmotionStatResponse;
import com.chh.watchover.domain.calendar.model.entity.CalendarLogEntity;
import com.chh.watchover.domain.calendar.model.type.EmotionType;
import com.chh.watchover.domain.calendar.repository.CalendarLogRepository;
import com.chh.watchover.domain.chatbot.model.entity.ChatRoomEntity;
import com.chh.watchover.domain.chatbot.model.entity.MessageEntity;
import com.chh.watchover.domain.chatbot.repository.ChatRoomRepository;
import com.chh.watchover.domain.chatbot.repository.MessageRepository;
import com.chh.watchover.domain.user.model.entity.UserEntity;
import com.chh.watchover.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
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

    @Transactional
    public String analyzeAndSaveToCalendar(Long chatRoomId) {
        return analyzeAndSaveToCalendar(chatRoomId, LocalDate.now());
    }

    @Transactional
    public String analyzeAndSaveToCalendar(Long chatRoomId, LocalDate targetDate) {
        ChatRoomEntity chatRoom = chatRoomRepository.findById(chatRoomId)
                .orElseThrow(() -> new RuntimeException("채팅방을 찾을 수 없습니다."));

        List<MessageEntity> history = messageRepository.findByChatRoomChatRoomIdOrderByCreatedAtAsc(chatRoomId);
        if (history.isEmpty()) {
            throw new RuntimeException("분석할 대화 내용이 없습니다.");
        }

        StringBuilder conversation = new StringBuilder();
        for (MessageEntity msg : history) {
            conversation.append(msg.getRole().name()).append(": ").append(msg.getContent()).append("\n");
        }

        String analyzedEmotion = normalizeEmotion(requestEmotionAnalysis(conversation.toString()));

        UserEntity user = chatRoom.getUser();
        LocalDate analysisDate = targetDate == null ? LocalDate.now() : targetDate;
        LocalDateTime startOfDay = analysisDate.atStartOfDay();
        LocalDateTime endOfDay = analysisDate.plusDays(1).atStartOfDay();

        CalendarLogEntity calendarLog = calendarLogRepository
                .findFirstByUserAndCreatedAtBetween(user, startOfDay, endOfDay)
                .orElseGet(CalendarLogEntity::new);
        calendarLog.setUser(user);
        calendarLog.setEmotion(EmotionType.valueOf(analyzedEmotion));
        calendarLog.setCreatedAt(startOfDay);
        calendarLogRepository.save(calendarLog);

        return analyzedEmotion;
    }

    @Transactional(readOnly = true)
    public List<EmotionStatResponse> getMonthlyEmotionStats(String loginId, int year, int month) {
        UserEntity user = userRepository.findByLoginId(loginId)
                .orElseThrow(() -> new RuntimeException("해당 유저를 찾을 수 없습니다."));

        return calendarLogRepository.getMonthlyStats(user, year, month);
    }

    @Transactional(readOnly = true)
    public List<EmotionLogResponse> getMonthlyEmotionLogs(String loginId, int year, int month) {
        UserEntity user = userRepository.findByLoginId(loginId)
                .orElseThrow(() -> new RuntimeException("해당 유저를 찾을 수 없습니다."));

        LocalDateTime start = LocalDate.of(year, month, 1).atStartOfDay();
        LocalDateTime end = start.plusMonths(1);

        return calendarLogRepository.findAllByUserAndCreatedAtBetweenOrderByCreatedAtAsc(user, start, end)
                .stream()
                .map(EmotionLogResponse::from)
                .toList();
    }

    private String requestEmotionAnalysis(String conversation) {
        String systemPrompt = "당신은 사용자의 대화를 분석하여 주된 감정을 하나로 분류하는 전문가입니다.";
        String userPrompt = "다음 대화 내역을 보고 사용자의 주된 감정을 하나만 골라주세요.\n"
                + "조건: 반드시 '기쁨', '슬픔', '화남', '혐오' 중 하나의 단어로만 대답하세요. 다른 설명은 절대 하지 마세요.\n\n"
                + "대화 내용:\n" + conversation;

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);

        List<Map<String, String>> messages = new ArrayList<>();
        messages.add(Map.of("role", "system", "content", systemPrompt));
        messages.add(Map.of("role", "user", "content", userPrompt));

        Map<String, Object> requestBody = Map.of(
                "model", "gpt-4o",
                "messages", messages,
                "temperature", 0.1
        );

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
        ResponseEntity<Map> response = restTemplate.postForEntity(
                "https://api.openai.com/v1/chat/completions",
                entity,
                Map.class
        );

        Map<String, Object> body = response.getBody();
        if (body == null) {
            throw new RuntimeException("감정 분석 응답이 비어 있습니다.");
        }

        List<Map<String, Object>> choices = (List<Map<String, Object>>) body.get("choices");
        if (choices == null || choices.isEmpty()) {
            throw new RuntimeException("감정 분석 결과가 비어 있습니다.");
        }

        Map<String, Object> messageMap = (Map<String, Object>) choices.get(0).get("message");
        if (messageMap == null || messageMap.get("content") == null) {
            throw new RuntimeException("감정 분석 메시지가 비어 있습니다.");
        }

        return ((String) messageMap.get("content")).trim();
    }

    private String normalizeEmotion(String rawEmotion) {
        if (rawEmotion == null || rawEmotion.isBlank()) {
            return EmotionType.슬픔.name();
        }

        String emotion = rawEmotion.trim();
        String lowerEmotion = emotion.toLowerCase(Locale.ROOT);

        if (emotion.contains("기쁨") || lowerEmotion.contains("happy") || lowerEmotion.contains("joy")) {
            return EmotionType.기쁨.name();
        }
        if (emotion.contains("슬픔") || lowerEmotion.contains("sad")) {
            return EmotionType.슬픔.name();
        }
        if (emotion.contains("화남") || emotion.contains("분노") || lowerEmotion.contains("anger")) {
            return EmotionType.화남.name();
        }
        if (emotion.contains("혐오") || lowerEmotion.contains("disgust")) {
            return EmotionType.혐오.name();
        }

        return EmotionType.슬픔.name();
    }
}
