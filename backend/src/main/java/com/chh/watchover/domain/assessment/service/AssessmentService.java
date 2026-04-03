package com.chh.watchover.domain.assessment.service;

import com.chh.watchover.domain.assessment.model.dto.AssessmentResponseDto;
import com.chh.watchover.domain.assessment.repository.AssessmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AssessmentService {
    private final AssessmentRepository assessmentRepository;

    public List<AssessmentResponseDto> getUserAssessments(Long userId) {
        return assessmentRepository.findByUserUserId(userId)
                .stream()
                .map(AssessmentResponseDto::from)
                .toList(); // Java 16+ 버전 기능
    }
}
