package com.chh.watchover.domain.chatbot.model.entity;

import com.chh.watchover.domain.user.model.entity.UserEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "chat_room")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ChatRoomEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "chat_room_id")
    private Long chatRoomId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    // 양방향 관계 설정 (선택 사항): 해당 방의 모든 메시지를 가져올 때 편리합니다.
    @OneToMany(mappedBy = "chatRoom", cascade = CascadeType.ALL)
    private List<MessageEntity> messages = new ArrayList<>();

    public static ChatRoomEntity create(UserEntity user) { // Long userId 대신 UserEntity를 받음
        ChatRoomEntity chatRoom = new ChatRoomEntity();
        chatRoom.user = user; // 필드명인 user에 객체를 할당 ✅
        chatRoom.createdAt = LocalDateTime.now();
        return chatRoom;
    }
}
