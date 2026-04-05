package com.chh.watchover.domain.calendar.model.dto;

import com.chh.watchover.domain.calendar.model.type.EmotionType;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class EmotionStatResponse {
    private EmotionType emotion; // 감정 종류
    private Long count;          // 횟수
}