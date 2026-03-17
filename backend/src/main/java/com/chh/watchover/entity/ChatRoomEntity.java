package com.chh.watchover.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "chat_room")
public class ChatRoomEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long chatRoomId;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
}
