package com.chh.watchover.domain.calendar.controller;

import com.chh.watchover.domain.calendar.model.dto.AnalysisResponse;
import com.chh.watchover.domain.calendar.model.dto.EmotionStatResponse;
import com.chh.watchover.domain.user.repository.UserRepository;
import com.chh.watchover.global.common.ApiResponse;
import com.chh.watchover.domain.calendar.service.AnalysisService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Tag(name = "Calendar", description = "감정 분석 및 달력 API")
@RestController
@RequestMapping("/api/calendar/emotion")
@RequiredArgsConstructor
public class AnalysisController {

    private final AnalysisService analysisService;
    private final UserRepository userRepository;

    @Operation(summary = "채팅방 감정 분석 후 달력 저장", description = "특정 채팅방의 대화 내역을 감정 분석하여 달력에 저장합니다.")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "감정 분석 및 저장 성공"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "채팅방 없음")
    })
    @PostMapping("/{chatingRoomId}")
    public ApiResponse<AnalysisResponse> analyzeEmotion(
            @Parameter(description = "감정 분석할 채팅방 ID", required = true) @PathVariable("chatingRoomId") Long chatRoomId
    ) {
        String emotionResult = analysisService.analyzeAndSaveToCalendar(chatRoomId);
        AnalysisResponse data = new AnalysisResponse(emotionResult, LocalDateTime.now());
        return ApiResponse.success(data);
    }

    @Operation(summary = "이번 달 감정 통계 조회", description = "현재 로그인된 사용자의 이번 달 감정 유형별 통계를 조회합니다.")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "통계 조회 성공"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "인증 실패")
    })
    @GetMapping("/stats")
    public ApiResponse<List<EmotionStatResponse>> getMonthlyStats(
            @AuthenticationPrincipal String loginId) {
        LocalDate now = LocalDate.now();
        List<EmotionStatResponse> stats = analysisService.getMonthlyEmotionStats(
                loginId,
                now.getYear(),
                now.getMonthValue()
        );
        return ApiResponse.success(stats);
    }
}