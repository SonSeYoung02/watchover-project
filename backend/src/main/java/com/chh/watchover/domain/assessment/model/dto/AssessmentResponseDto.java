package com.chh.watchover.domain.assessment.model.dto;

import com.chh.watchover.domain.assessment.model.entity.AssessmentEntity;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Getter;

@Schema(description = "심리검사 결과 응답")
@Getter
@Builder
public class AssessmentResponseDto {
    @Schema(description = "심리검사 결과 ID")
    private Long id;
    @Schema(description = "검사 결과 내용")
    private String result;

    // Entity를 DTO로 변환하는 static 메서드
    public static AssessmentResponseDto from(AssessmentEntity assessmentEntity) {
        return AssessmentResponseDto.builder()
                .id(assessmentEntity.getAssessmentId())
                .result(assessmentEntity.getResult())
                .build();
    }
}