package com.chh.watchover.domain.calendar.model.dto;

import com.chh.watchover.domain.calendar.model.type.EmotionType;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Schema(description = "이번 달 감정 통계 응답")
@Getter
@AllArgsConstructor
public class EmotionStatResponse {
    @Schema(description = "감정 종류")
    private EmotionType emotion;
    @Schema(description = "해당 감정 발생 횟수", example = "5")
    private Long count;
}