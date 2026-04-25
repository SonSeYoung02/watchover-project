package com.chh.watchover.domain.assessment.controller;

import com.chh.watchover.domain.assessment.model.dto.AssessmentResponseDto;
import com.chh.watchover.domain.assessment.service.AssessmentService;
import com.chh.watchover.global.common.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@Tag(name = "Assessment", description = "심리 검사 결과 API")
@RestController
@RequestMapping("/api/assessments")
@RequiredArgsConstructor
public class AssessmentController {

    private final AssessmentService assessmentService;

    @Operation(summary = "내 심리검사 결과 조회", description = "현재 로그인된 사용자의 심리검사 결과 목록을 조회합니다.")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "조회 성공"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "인증 실패")
    })
    @GetMapping
    public ApiResponse<List<AssessmentResponseDto>> getMyResults(
            @AuthenticationPrincipal String loginId
    ) {
        List<AssessmentResponseDto> responses = assessmentService.getUserAssessmentsByLoginId(loginId);
        return ApiResponse.success(responses);
    }
}