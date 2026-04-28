package com.chh.watchover.domain.calendar.model.dto;

import com.chh.watchover.domain.calendar.model.entity.CalendarLogEntity;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDate;

@Schema(description = "날짜별 감정 기록 응답")
public record EmotionLogResponse(
        @Schema(description = "기록 날짜") LocalDate date,
        @Schema(description = "감정 종류") String emotion
) {
    public static EmotionLogResponse from(CalendarLogEntity entity) {
        return new EmotionLogResponse(
                entity.getCreatedAt().toLocalDate(),
                entity.getEmotion().name()
        );
    }
}
