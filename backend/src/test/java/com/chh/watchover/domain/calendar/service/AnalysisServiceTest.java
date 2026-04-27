package com.chh.watchover.domain.calendar.service;

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
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AnalysisServiceTest {

    @Mock
    private UserRepository userRepository;
    @Mock
    private MessageRepository messageRepository;
    @Mock
    private ChatRoomRepository chatRoomRepository;
    @Mock
    private CalendarLogRepository calendarLogRepository;

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
    void analyzeAndSaveToCalendar_returnsNoContentMessage_whenHistoryIsEmpty() {
        ChatRoomEntity chatRoom = mock(ChatRoomEntity.class);
        when(chatRoomRepository.findById(1L)).thenReturn(Optional.of(chatRoom));
        when(messageRepository.findByChatRoomChatRoomIdOrderByCreatedAtAsc(1L)).thenReturn(List.of());

        String result = analysisService.analyzeAndSaveToCalendar(1L);

        assertThat(result).isEqualTo("분석할 대화 내용이 없습니다.");
        verifyNoInteractions(calendarLogRepository);
    }

    @Test
    void analyzeAndSaveToCalendar_savesCalendarLog_andReturnsEmotion_whenGptReturnsValidEmotion() {
        UserEntity user = mock(UserEntity.class);
        ChatRoomEntity chatRoom = mock(ChatRoomEntity.class);
        when(chatRoom.getUser()).thenReturn(user);

        MessageEntity message = mock(MessageEntity.class);
        when(message.getRole()).thenReturn(Role.user);
        when(message.getContent()).thenReturn("오늘 행복해요");

        when(chatRoomRepository.findById(1L)).thenReturn(Optional.of(chatRoom));
        when(messageRepository.findByChatRoomChatRoomIdOrderByCreatedAtAsc(1L)).thenReturn(List.of(message));

        Map<String, Object> messageMap = Map.of("content", "기쁨");
        Map<String, Object> choice = Map.of("message", messageMap);
        Map<String, Object> body = Map.of("choices", List.of(choice));
        ResponseEntity<Map> responseEntity = ResponseEntity.ok(body);
        when(mockRestTemplate.postForEntity(anyString(), any(), eq(Map.class))).thenReturn(responseEntity);
        when(calendarLogRepository.findFirstByUserAndCreatedAtBetween(eq(user), any(), any()))
                .thenReturn(Optional.empty());

        String result = analysisService.analyzeAndSaveToCalendar(1L, LocalDate.of(2026, 4, 28));

        assertThat(result).isEqualTo("기쁨");
        ArgumentCaptor<CalendarLogEntity> captor = ArgumentCaptor.forClass(CalendarLogEntity.class);
        verify(calendarLogRepository).save(captor.capture());
        assertThat(captor.getValue().getEmotion()).isEqualTo(EmotionType.기쁨);
        assertThat(captor.getValue().getUser()).isEqualTo(user);
        assertThat(captor.getValue().getCreatedAt()).isEqualTo(LocalDate.of(2026, 4, 28).atStartOfDay());
    }

    @Test
    void analyzeAndSaveToCalendar_savesWithDefaultEmotion_whenGptReturnsUnrecognizedValue() {
        UserEntity user = mock(UserEntity.class);
        ChatRoomEntity chatRoom = mock(ChatRoomEntity.class);
        when(chatRoom.getUser()).thenReturn(user);

        MessageEntity message = mock(MessageEntity.class);
        when(message.getRole()).thenReturn(Role.user);
        when(message.getContent()).thenReturn("텍스트");

        when(chatRoomRepository.findById(1L)).thenReturn(Optional.of(chatRoom));
        when(messageRepository.findByChatRoomChatRoomIdOrderByCreatedAtAsc(1L)).thenReturn(List.of(message));

        Map<String, Object> messageMap = Map.of("content", "알수없음");
        Map<String, Object> choice = Map.of("message", messageMap);
        Map<String, Object> body = Map.of("choices", List.of(choice));
        ResponseEntity<Map> responseEntity = ResponseEntity.ok(body);
        when(mockRestTemplate.postForEntity(anyString(), any(), eq(Map.class))).thenReturn(responseEntity);
        when(calendarLogRepository.findFirstByUserAndCreatedAtBetween(eq(user), any(), any()))
                .thenReturn(Optional.empty());

        analysisService.analyzeAndSaveToCalendar(1L);

        ArgumentCaptor<CalendarLogEntity> captor = ArgumentCaptor.forClass(CalendarLogEntity.class);
        verify(calendarLogRepository).save(captor.capture());
        assertThat(captor.getValue().getEmotion()).isEqualTo(EmotionType.슬픔);
    }

    @Test
    void getMonthlyEmotionStats_throwsRuntimeException_whenUserNotFound() {
        when(userRepository.findByLoginId("ghost")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> analysisService.getMonthlyEmotionStats("ghost", 2024, 1))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("해당 유저를 찾을 수 없습니다");
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
    void getMonthlyEmotionStats_returnsEmptyList_whenNoLogsForMonth() {
        UserEntity user = mock(UserEntity.class);
        when(userRepository.findByLoginId("user1")).thenReturn(Optional.of(user));
        when(calendarLogRepository.getMonthlyStats(user, 2024, 2)).thenReturn(List.of());

        List<EmotionStatResponse> result = analysisService.getMonthlyEmotionStats("user1", 2024, 2);

        assertThat(result).isEmpty();
    }
}
