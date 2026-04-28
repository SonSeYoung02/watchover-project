package com.chh.watchover.domain.calendar.service;

import com.chh.watchover.domain.calendar.model.dto.AnalysisResponse;
import com.chh.watchover.domain.calendar.model.dto.DailyAnalysisResponse;
import com.chh.watchover.domain.calendar.model.dto.EmotionLogResponse;
import com.chh.watchover.domain.calendar.model.dto.EmotionStatResponse;
import com.chh.watchover.domain.calendar.model.entity.CalendarLogEntity;
import com.chh.watchover.domain.calendar.model.type.EmotionType;
import com.chh.watchover.domain.calendar.repository.CalendarLogRepository;
import com.chh.watchover.domain.chatbot.model.entity.ChatRoomEntity;
import com.chh.watchover.domain.chatbot.model.entity.MessageEntity;
import com.chh.watchover.domain.chatbot.model.type.Role;
import com.chh.watchover.domain.chatbot.repository.ChatRoomRepository;
import com.chh.watchover.domain.chatbot.repository.MessageRepository;
import com.chh.watchover.domain.user.model.entity.UserEntity;
import com.chh.watchover.domain.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AnalysisServiceTest {

    @Mock private UserRepository userRepository;
    @Mock private MessageRepository messageRepository;
    @Mock private ChatRoomRepository chatRoomRepository;
    @Mock private CalendarLogRepository calendarLogRepository;

    @InjectMocks
    private AnalysisService analysisService;

    private RestTemplate mockRestTemplate;

    @BeforeEach
    void setUp() {
        mockRestTemplate = mock(RestTemplate.class);
        ReflectionTestUtils.setField(analysisService, "restTemplate", mockRestTemplate);
        ReflectionTestUtils.setField(analysisService, "apiKey", "test-api-key");
    }

    @Test
    void analyzeAndSaveToCalendar_throwsRuntimeException_whenChatRoomNotFound() {
        when(chatRoomRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> analysisService.analyzeAndSaveToCalendar(99L))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("채팅방을 찾을 수 없습니다");
    }

    @Test
    void analyzeAndSaveToCalendar_throwsRuntimeException_whenHistoryIsEmpty() {
        ChatRoomEntity chatRoom = mock(ChatRoomEntity.class);
        when(chatRoomRepository.findById(1L)).thenReturn(Optional.of(chatRoom));
        when(messageRepository.findByChatRoomChatRoomIdOrderByCreatedAtAsc(1L)).thenReturn(List.of());

        assertThatThrownBy(() -> analysisService.analyzeAndSaveToCalendar(1L))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("분석할 대화 내용이 없습니다");
        verifyNoInteractions(calendarLogRepository);
    }

    @Test
    void analyzeAndSaveToCalendar_savesCalendarLog_andReturnsEmotion_whenGptReturnsValidEmotion() {
        UserEntity user = mock(UserEntity.class);
        ChatRoomEntity chatRoom = mock(ChatRoomEntity.class);
        MessageEntity message = mock(MessageEntity.class);

        when(chatRoom.getUser()).thenReturn(user);
        when(message.getRole()).thenReturn(Role.user);
        when(message.getContent()).thenReturn("오늘 행복해요");
        when(chatRoomRepository.findById(1L)).thenReturn(Optional.of(chatRoom));
        when(messageRepository.findByChatRoomChatRoomIdOrderByCreatedAtAsc(1L)).thenReturn(List.of(message));
        when(mockRestTemplate.postForEntity(anyString(), any(), eq(Map.class)))
                .thenReturn(ResponseEntity.ok(Map.of(
                        "choices",
                        List.of(Map.of("message", Map.of("content", "기쁨")))
                )));
        when(calendarLogRepository.findFirstByUserAndCreatedAtBetween(eq(user), any(), any()))
                .thenReturn(Optional.empty());

        AnalysisResponse result = analysisService.analyzeAndSaveToCalendar(1L, LocalDate.of(2026, 4, 28));

        assertThat(result.getEmotion()).isEqualTo("기쁨");
        ArgumentCaptor<CalendarLogEntity> captor = ArgumentCaptor.forClass(CalendarLogEntity.class);
        verify(calendarLogRepository).save(captor.capture());
        assertThat(captor.getValue().getEmotion()).isEqualTo(EmotionType.기쁨);
        assertThat(captor.getValue().getUser()).isEqualTo(user);
        assertThat(captor.getValue().getCreatedAt()).isEqualTo(LocalDate.of(2026, 4, 28).atStartOfDay());
    }

    @Test
    void analyzeAndSaveToCalendar_savesSummaryAndAnalysis_whenGptReturnsJson() {
        UserEntity user = mock(UserEntity.class);
        ChatRoomEntity chatRoom = mock(ChatRoomEntity.class);
        MessageEntity message = mock(MessageEntity.class);

        when(chatRoom.getUser()).thenReturn(user);
        when(message.getRole()).thenReturn(Role.user);
        when(message.getContent()).thenReturn("일이 잘 풀려서 기뻐요");
        when(chatRoomRepository.findById(1L)).thenReturn(Optional.of(chatRoom));
        when(messageRepository.findByChatRoomChatRoomIdOrderByCreatedAtAsc(1L)).thenReturn(List.of(message));
        when(mockRestTemplate.postForEntity(anyString(), any(), eq(Map.class)))
                .thenReturn(ResponseEntity.ok(Map.of(
                        "choices",
                        List.of(Map.of("message", Map.of(
                                "content",
                                "{\"emotion\":\"기쁨\",\"summary\":\"일이 잘 풀려 기분이 좋아진 대화입니다.\",\"analysis\":\"긍정 표현이 반복되어 기쁨으로 판단했습니다.\"}"
                        )))
                )));
        when(calendarLogRepository.findFirstByUserAndCreatedAtBetween(eq(user), any(), any()))
                .thenReturn(Optional.empty());

        AnalysisResponse result = analysisService.analyzeAndSaveToCalendar(1L, LocalDate.of(2026, 4, 28));

        assertThat(result.getEmotion()).isEqualTo("기쁨");
        assertThat(result.getSummary()).isEqualTo("일이 잘 풀려 기분이 좋아진 대화입니다.");
        assertThat(result.getAnalysis()).isEqualTo("긍정 표현이 반복되어 기쁨으로 판단했습니다.");
        ArgumentCaptor<CalendarLogEntity> captor = ArgumentCaptor.forClass(CalendarLogEntity.class);
        verify(calendarLogRepository).save(captor.capture());
        assertThat(captor.getValue().getEmotion()).isEqualTo(EmotionType.기쁨);
    }

    @Test
    void analyzeAndSaveToCalendar_savesWithDefaultEmotion_whenGptReturnsUnrecognizedValue() {
        UserEntity user = mock(UserEntity.class);
        ChatRoomEntity chatRoom = mock(ChatRoomEntity.class);
        MessageEntity message = mock(MessageEntity.class);

        when(chatRoom.getUser()).thenReturn(user);
        when(message.getRole()).thenReturn(Role.user);
        when(message.getContent()).thenReturn("테스트");
        when(chatRoomRepository.findById(1L)).thenReturn(Optional.of(chatRoom));
        when(messageRepository.findByChatRoomChatRoomIdOrderByCreatedAtAsc(1L)).thenReturn(List.of(message));
        when(mockRestTemplate.postForEntity(anyString(), any(), eq(Map.class)))
                .thenReturn(ResponseEntity.ok(Map.of(
                        "choices",
                        List.of(Map.of("message", Map.of("content", "알 수 없음")))
                )));
        when(calendarLogRepository.findFirstByUserAndCreatedAtBetween(eq(user), any(), any()))
                .thenReturn(Optional.empty());

        analysisService.analyzeAndSaveToCalendar(1L);

        ArgumentCaptor<CalendarLogEntity> captor = ArgumentCaptor.forClass(CalendarLogEntity.class);
        verify(calendarLogRepository).save(captor.capture());
        assertThat(captor.getValue().getEmotion()).isEqualTo(EmotionType.슬픔);
    }

    @Test
    void getMonthlyEmotionStats_returnsStats_whenUserExists() {
        UserEntity user = mock(UserEntity.class);
        List<EmotionStatResponse> expected = List.of(
                new EmotionStatResponse(EmotionType.기쁨, 5L),
                new EmotionStatResponse(EmotionType.슬픔, 2L)
        );

        when(userRepository.findByLoginId("user1")).thenReturn(Optional.of(user));
        when(calendarLogRepository.getMonthlyStats(user, 2024, 3)).thenReturn(expected);

        List<EmotionStatResponse> result = analysisService.getMonthlyEmotionStats("user1", 2024, 3);

        assertThat(result).hasSize(2);
        assertThat(result.get(0).getEmotion()).isEqualTo(EmotionType.기쁨);
        assertThat(result.get(0).getCount()).isEqualTo(5L);
    }

    @Test
    void getDailyEmotionStats_returnsStats_whenUserExists() {
        UserEntity user = mock(UserEntity.class);
        List<EmotionStatResponse> expected = List.of(
                new EmotionStatResponse(EmotionType.화남, 1L)
        );

        when(userRepository.findByLoginId("user1")).thenReturn(Optional.of(user));
        when(calendarLogRepository.getDailyStats(eq(user), any(), any())).thenReturn(expected);

        List<EmotionStatResponse> result = analysisService.getDailyEmotionStats("user1", LocalDate.of(2026, 4, 1));

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getEmotion()).isEqualTo(EmotionType.화남);
        assertThat(result.get(0).getCount()).isEqualTo(1L);
    }

    @Test
    void getMonthlyEmotionLogs_returnsLogs_whenUserExists() {
        UserEntity user = mock(UserEntity.class);
        CalendarLogEntity log = new CalendarLogEntity();
        log.setUser(user);
        log.setEmotion(EmotionType.화남);
        log.setCreatedAt(LocalDate.of(2026, 4, 28).atStartOfDay());

        when(userRepository.findByLoginId("user1")).thenReturn(Optional.of(user));
        when(calendarLogRepository.findAllByUserAndCreatedAtBetweenOrderByCreatedAtAsc(eq(user), any(), any()))
                .thenReturn(List.of(log));

        List<EmotionLogResponse> result = analysisService.getMonthlyEmotionLogs("user1", 2026, 4);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).date()).isEqualTo(LocalDate.of(2026, 4, 28));
        assertThat(result.get(0).emotion()).isEqualTo("화남");
    }

    @Test
    void getDailyAnalysis_returnsSavedEmotionAndGeneratedAnalysis_whenConversationExists() {
        UserEntity user = mock(UserEntity.class);
        ChatRoomEntity chatRoom = mock(ChatRoomEntity.class);
        MessageEntity message = mock(MessageEntity.class);
        CalendarLogEntity log = new CalendarLogEntity();
        log.setUser(user);
        log.setEmotion(EmotionType.화남);
        log.setCreatedAt(LocalDate.of(2026, 4, 28).atStartOfDay());

        when(userRepository.findByLoginId("user1")).thenReturn(Optional.of(user));
        when(calendarLogRepository.findFirstByUserAndCreatedAtBetween(eq(user), any(), any()))
                .thenReturn(Optional.of(log));
        when(chatRoomRepository.findByUserAndCreatedAtBetweenOrderByCreatedAtAsc(eq(user), any(), any()))
                .thenReturn(List.of(chatRoom));
        when(chatRoom.getChatRoomId()).thenReturn(1L);
        when(messageRepository.findByChatRoomChatRoomIdOrderByCreatedAtAsc(1L)).thenReturn(List.of(message));
        when(message.getRole()).thenReturn(Role.user);
        when(message.getContent()).thenReturn("너무 짜증났어요");
        when(mockRestTemplate.postForEntity(anyString(), any(), eq(Map.class)))
                .thenReturn(ResponseEntity.ok(Map.of(
                        "choices",
                        List.of(Map.of("message", Map.of(
                                "content",
                                "{\"emotion\":\"화남\",\"summary\":\"짜증 나는 일을 이야기했습니다.\",\"analysis\":\"분노 표현이 많아 화남으로 판단했습니다.\"}"
                        )))
                )));

        DailyAnalysisResponse result = analysisService.getDailyAnalysis("user1", LocalDate.of(2026, 4, 28));

        assertThat(result.date()).isEqualTo(LocalDate.of(2026, 4, 28));
        assertThat(result.emotion()).isEqualTo("화남");
        assertThat(result.summary()).isEqualTo("짜증 나는 일을 이야기했습니다.");
        assertThat(result.analysis()).isEqualTo("분노 표현이 많아 화남으로 판단했습니다.");
    }
}
