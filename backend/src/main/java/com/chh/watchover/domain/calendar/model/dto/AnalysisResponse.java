package com.chh.watchover.domain.calendar.model.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class AnalysisResponse {
    private String emotion;      // 분석된 감정 (기쁨, 슬픔 등)
    private LocalDateTime analyzedAt; // 분석 시점
}