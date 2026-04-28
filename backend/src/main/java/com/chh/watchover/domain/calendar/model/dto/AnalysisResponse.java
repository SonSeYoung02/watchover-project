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
    @Schema(description = "대화 요약", example = "사용자는 오늘 좋은 일이 있어 전반적으로 밝은 기분을 보였습니다.")
    private String summary;
    @Schema(description = "감정 분석 내용", example = "긍정적인 사건을 반복해서 언급했고 표현의 강도가 높아 기쁨으로 분류했습니다.")
    private String analysis;
    @Schema(description = "분석 시점")
    private LocalDateTime analyzedAt;
}
