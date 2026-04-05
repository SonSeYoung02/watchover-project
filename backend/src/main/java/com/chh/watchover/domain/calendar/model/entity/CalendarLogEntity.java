package com.chh.watchover.domain.calendar.model.entity;

import com.chh.watchover.domain.calendar.model.type.EmotionType;
import com.chh.watchover.domain.user.model.entity.UserEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "calendar_log")
@Getter
@Setter
public class CalendarLogEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "calendar_log_id")
    private Long calendarLogId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;

    @Enumerated(EnumType.STRING) // DB의 enum과 매핑
    private EmotionType emotion; // '기쁨', '슬픔', '화남', '혐오'

    private LocalDateTime createdAt = LocalDateTime.now();
}
