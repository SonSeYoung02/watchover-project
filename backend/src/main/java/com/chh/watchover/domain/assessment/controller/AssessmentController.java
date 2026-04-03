package com.chh.watchover.domain.assessment.controller;

import com.chh.watchover.domain.assessment.model.dto.AssessmentResponseDto;
import com.chh.watchover.domain.assessment.service.AssessmentService;
import com.chh.watchover.global.common.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/assessments")
@RequiredArgsConstructor
public class AssessmentController {
    private final AssessmentService assessmentService;

    @GetMapping("/{userId}")
    public ApiResponse<List<AssessmentResponseDto>> getResults(@PathVariable Long userId) {
        List<AssessmentResponseDto> responses = assessmentService.getUserAssessments(userId);
        return ApiResponse.success(responses);
    }
}