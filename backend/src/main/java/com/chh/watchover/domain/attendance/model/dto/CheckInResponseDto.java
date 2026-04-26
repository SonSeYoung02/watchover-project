package com.chh.watchover.domain.attendance.model.dto;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDate;

@Schema(description = "출석 체크 응답")
@JsonPropertyOrder({"checkInDate", "currentStreak", "totalCheckIns", "message"})
public record CheckInResponseDto(
        @Schema(description = "출석 날짜") LocalDate checkInDate,
        @Schema(description = "현재 연속 출석 일수") int currentStreak,
        @Schema(description = "전체 출석 일수") long totalCheckIns,
        @Schema(description = "보상 메시지") String message
) {
    public static CheckInResponseDto of(LocalDate checkInDate, int currentStreak, long totalCheckIns) {
        return new CheckInResponseDto(checkInDate, currentStreak, totalCheckIns, resolveMessage(currentStreak));
    }

    private static String resolveMessage(int streak) {
        if (streak >= 30) return streak + "일 연속 출석! 마음의 챔피언이에요!";
        if (streak >= 7)  return streak + "일 연속 출석! 대단해요!";
        if (streak >= 3)  return streak + "일째 마음을 돌보고 있어요!";
        return "오늘도 마음을 돌봤어요!";
    }
}
