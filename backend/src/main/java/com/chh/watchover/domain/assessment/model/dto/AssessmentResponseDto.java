package com.chh.watchover.domain.assessment.model.dto;

import com.chh.watchover.domain.assessment.model.entity.AssessmentEntity;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AssessmentResponseDto {
    private Long id;
    private String result;

    // Entity를 DTO로 변환하는 static 메서드
    public static AssessmentResponseDto from(AssessmentEntity assessmentEntity) {
        return AssessmentResponseDto.builder()
                .id(assessmentEntity.getAssessmentId())
                .result(assessmentEntity.getResult())
                .build();
    }
}