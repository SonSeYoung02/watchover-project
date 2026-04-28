package com.chh.watchover.domain.calendar.model.entity;

import com.chh.watchover.domain.calendar.model.type.EmotionType;
import com.chh.watchover.domain.calendar.model.type.EmotionTypeConverter;
import com.chh.watchover.domain.user.model.entity.UserEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
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

    @Convert(converter = EmotionTypeConverter.class)
    private EmotionType emotion;

    private LocalDateTime createdAt = LocalDateTime.now();
}
