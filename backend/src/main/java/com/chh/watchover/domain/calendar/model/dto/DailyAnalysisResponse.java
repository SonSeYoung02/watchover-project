package com.chh.watchover.domain.calendar.model.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDate;

@Schema(description = "날짜별 대화 기반 감정 분석 응답")
public record DailyAnalysisResponse(
        @Schema(description = "분석 날짜") LocalDate date,
        @Schema(description = "분석된 감정") String emotion,
        @Schema(description = "대화 요약") String summary,
        @Schema(description = "감정 분석 내용") String analysis
) {
}
