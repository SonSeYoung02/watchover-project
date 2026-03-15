package com.chh.watchover.entity;

import com.chh.watchover.entity.enums.Emotion;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "calendar_log")
public class CalendarLogEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long calendarLogId;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "emotion", nullable = false)
    @Enumerated(EnumType.STRING)
    private Emotion emotion;

    @Column(name = "created_at")
    private LocalDateTime createdAt;
}
