package com.chh.watchover.domain.calendar.model.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Schema(description = "감정 분석 결과 응답")
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class AnalysisResponse {
    @Schema(description = "분석된 감정 (기쁨, 슬픔 등)", example = "기쁨")
    private String emotion;
    @Schema(description = "분석 시점")
    private LocalDateTime analyzedAt;
}