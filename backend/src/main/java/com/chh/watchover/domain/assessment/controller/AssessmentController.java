package com.chh.watchover.domain.assessment.controller;

import com.chh.watchover.domain.assessment.model.dto.AssessmentResponseDto;
import com.chh.watchover.domain.assessment.service.AssessmentService;
import com.chh.watchover.global.common.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/assessments")
@RequiredArgsConstructor
public class AssessmentController {

    private final AssessmentService assessmentService;

    @GetMapping
    public ApiResponse<List<AssessmentResponseDto>> getMyResults(
            @AuthenticationPrincipal String loginId // JWT에서 추출된 유저 정보
    ) {
        List<AssessmentResponseDto> responses = assessmentService.getUserAssessmentsByLoginId(loginId);
        return ApiResponse.success(responses);
    }
}