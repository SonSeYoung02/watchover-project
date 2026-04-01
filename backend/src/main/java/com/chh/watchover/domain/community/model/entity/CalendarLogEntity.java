package com.chh.watchover.domain.community.model.entity;

import com.chh.watchover.domain.user.model.entity.UserEntity;
import com.chh.watchover.domain.community.model.type.Emotion;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "calendar_log")
public class CalendarLogEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long calendarLogId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;

    @Column(name = "emotion", nullable = false)
    @Enumerated(EnumType.STRING)
    private Emotion emotion;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}
