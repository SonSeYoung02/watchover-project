package com.chh.watchover.domain.attendance.model.dto;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDate;

@Schema(description = "스트릭 조회 응답")
@JsonPropertyOrder({"currentStreak", "maxStreak", "totalCheckIns", "lastCheckInDate"})
public record StreakResponseDto(
        @Schema(description = "현재 연속 출석 일수") int currentStreak,
        @Schema(description = "최대 연속 출석 일수") int maxStreak,
        @Schema(description = "전체 출석 일수") long totalCheckIns,
        @Schema(description = "마지막 출석 날짜") LocalDate lastCheckInDate
) {
    public static StreakResponseDto of(int currentStreak, int maxStreak, long totalCheckIns, LocalDate lastCheckInDate) {
        return new StreakResponseDto(currentStreak, maxStreak, totalCheckIns, lastCheckInDate);
    }
}
