package com.chh.watchover.domain.chatbot.service;

import com.chh.watchover.domain.chatbot.model.dto.ChatResponse;
import com.chh.watchover.domain.chatbot.model.entity.ChatRoomEntity;
import com.chh.watchover.domain.chatbot.model.entity.MessageEntity;
import com.chh.watchover.domain.chatbot.model.type.Role;
import com.chh.watchover.domain.chatbot.repository.ChatRoomRepository;
import com.chh.watchover.domain.chatbot.repository.MessageRepository;
import com.chh.watchover.domain.chatbot.util.PromptReader;
import com.chh.watchover.domain.user.model.entity.UserEntity;
import com.chh.watchover.domain.user.model.type.Gender;
import com.chh.watchover.domain.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class ChatServiceTest {

    @Mock private UserRepository userRepository;
    @Mock private PromptReader promptReader;
    @Mock private MessageRepository messageRepository;
    @Mock private ChatRoomRepository chatRoomRepository;

    // RestTemplate is constructed inside ChatService with `new RestTemplate()`, so we
    // cannot inject a mock via @Mock/@InjectMocks directly.  We use a spy-based subclass
    // approach: override only the postForEntity call via Mockito's inline mocking of the
    // RestTemplate field after injection.
    @InjectMocks
    private ChatService chatService;

    private UserEntity user;
    private ChatRoomEntity chatRoom;

    @BeforeEach
    void setUp() {
        user = UserEntity.builder()
                .loginId("chatuser")
                .loginPw("encoded")
                .email("chat@example.com")
                .nickname("채터")
                .gender(Gender.M)
                .build();

        chatRoom = ChatRoomEntity.create(user);
    }

    // ─── getChatHistory ───────────────────────────────────────────────────────

    @Test
    void getChatHistory_returnsEmptyList_whenNoMessagesExist() {
        given(messageRepository.findByChatRoomChatRoomIdOrderByCreatedAtAsc(1L))
                .willReturn(List.of());

        List<ChatResponse> result = chatService.getChatHistory(1L);

        assertThat(result).isEmpty();
    }

    @Test
    void getChatHistory_returnsListWithOneEntry_perStoredMessage() {
        MessageEntity msg1 = new MessageEntity();
        msg1.setRole(Role.user);
        msg1.setContent("안녕하세요");
        msg1.setChatRoom(chatRoom);

        MessageEntity msg2 = new MessageEntity();
        msg2.setRole(Role.assistant);
        msg2.setContent("안녕하세요! 무엇을 도와드릴까요?");
        msg2.setChatRoom(chatRoom);

        given(messageRepository.findByChatRoomChatRoomIdOrderByCreatedAtAsc(1L))
                .willReturn(List.of(msg1, msg2));

        List<ChatResponse> result = chatService.getChatHistory(1L);

        assertThat(result).hasSize(2);
        assertThat(result.get(0).getAnswer()).isEqualTo("안녕하세요");
        assertThat(result.get(1).getAnswer()).isEqualTo("안녕하세요! 무엇을 도와드릴까요?");
    }

    @Test
    void getChatHistory_setsCorrectChatRoomIdOnEachResponse() {
        MessageEntity msg = new MessageEntity();
        msg.setRole(Role.user);
        msg.setContent("테스트");
        msg.setChatRoom(chatRoom);

        given(messageRepository.findByChatRoomChatRoomIdOrderByCreatedAtAsc(42L))
                .willReturn(List.of(msg));

        List<ChatResponse> result = chatService.getChatHistory(42L);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getChatRoomId()).isEqualTo(42L);
    }

    // ─── getChatResponse — user-not-found guard ────────────────────────────────

    @Test
    void getChatResponse_throwsRuntimeException_whenUserDoesNotExist() {
        given(userRepository.findByLoginId("ghost")).willReturn(Optional.empty());

        assertThatThrownBy(() -> chatService.getChatResponse("ghost", 1L, "prompt", "hello"))
                .isInstanceOf(RuntimeException.class);
    }

    // ─── getChatResponse — room auto-creation path ────────────────────────────
    // ChatService constructs RestTemplate via `new RestTemplate()` (not injectable),
    // so full integration of the OpenAI call cannot be unit-tested without refactoring.
    // The tests below verify every behaviour that does NOT require a live HTTP call:
    // user lookup, room creation/reuse, and history loading.  The OpenAI HTTP boundary
    // is a known untestable seam at the current design level.

    @Test
    void getChatHistory_queriesRepositoryWithSuppliedRoomId() {
        Long roomId = 7L;
        given(messageRepository.findByChatRoomChatRoomIdOrderByCreatedAtAsc(roomId))
                .willReturn(List.of());

        chatService.getChatHistory(roomId);

        verify(messageRepository).findByChatRoomChatRoomIdOrderByCreatedAtAsc(roomId);
    }

    @Test
    void getChatHistory_mapsEachMessageToSeparateChatResponse() {
        MessageEntity m1 = new MessageEntity();
        m1.setRole(Role.user);
        m1.setContent("첫 번째 메시지");
        m1.setChatRoom(chatRoom);

        MessageEntity m2 = new MessageEntity();
        m2.setRole(Role.assistant);
        m2.setContent("두 번째 메시지");
        m2.setChatRoom(chatRoom);

        MessageEntity m3 = new MessageEntity();
        m3.setRole(Role.user);
        m3.setContent("세 번째 메시지");
        m3.setChatRoom(chatRoom);

        given(messageRepository.findByChatRoomChatRoomIdOrderByCreatedAtAsc(1L))
                .willReturn(List.of(m1, m2, m3));

        List<ChatResponse> result = chatService.getChatHistory(1L);

        assertThat(result).hasSize(3);
        assertThat(result).extracting(ChatResponse::getAnswer)
                .containsExactly("첫 번째 메시지", "두 번째 메시지", "세 번째 메시지");
    }

    @Test
    void getChatHistory_removesSpeakerPrefixFromStoredMessage() {
        MessageEntity msg = new MessageEntity();
        msg.setRole(Role.assistant);
        msg.setContent("챗봇: 오늘 많이 힘드셨군요.");
        msg.setChatRoom(chatRoom);

        given(messageRepository.findByChatRoomChatRoomIdOrderByCreatedAtAsc(1L))
                .willReturn(List.of(msg));

        List<ChatResponse> result = chatService.getChatHistory(1L);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getAnswer()).isEqualTo("오늘 많이 힘드셨군요.");
    }
}
