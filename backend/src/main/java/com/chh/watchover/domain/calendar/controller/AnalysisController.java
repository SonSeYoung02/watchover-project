package com.chh.watchover.domain.calendar.controller;

import com.chh.watchover.domain.calendar.model.dto.AnalysisResponse;
import com.chh.watchover.domain.calendar.model.dto.EmotionLogResponse;
import com.chh.watchover.domain.calendar.model.dto.EmotionStatResponse;
import com.chh.watchover.domain.calendar.service.AnalysisService;
import com.chh.watchover.global.common.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@Tag(name = "Calendar", description = "감정 분석 및 달력 API")
@RestController
@RequestMapping("/api/calendar/emotion")
@RequiredArgsConstructor
public class AnalysisController {

    private final AnalysisService analysisService;

    @Operation(summary = "채팅방 감정 분석 후 달력 저장", description = "특정 채팅방의 대화 내역을 감정 분석하여 달력에 저장합니다.")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "감정 분석 및 저장 성공"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "채팅방 없음")
    })
    @PostMapping("/{chatingRoomId}")
    public ApiResponse<AnalysisResponse> analyzeEmotion(
            @Parameter(description = "감정 분석할 채팅방 ID", required = true)
            @PathVariable("chatingRoomId") Long chatRoomId,
            @Parameter(description = "저장할 날짜(yyyy-MM-dd). 생략 시 오늘 날짜")
            @RequestParam(required = false) LocalDate date
    ) {
        LocalDate analysisDate = date == null ? LocalDate.now() : date;
        String emotionResult = analysisService.analyzeAndSaveToCalendar(chatRoomId, analysisDate);
        AnalysisResponse data = new AnalysisResponse(emotionResult, analysisDate.atStartOfDay());
        return ApiResponse.success(data);
    }

    @Operation(summary = "월별 감정 통계 조회", description = "현재 로그인된 사용자의 지정 월 감정 유형별 통계를 조회합니다.")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "통계 조회 성공"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "인증 실패")
    })
    @GetMapping("/stats")
    public ApiResponse<List<EmotionStatResponse>> getMonthlyStats(
            @AuthenticationPrincipal String loginId,
            @Parameter(description = "조회 연도. 생략 시 현재 연도")
            @RequestParam(required = false) Integer year,
            @Parameter(description = "조회 월(1-12). 생략 시 현재 월")
            @RequestParam(required = false) Integer month
    ) {
        LocalDate now = LocalDate.now();
        List<EmotionStatResponse> stats = analysisService.getMonthlyEmotionStats(
                loginId,
                year == null ? now.getYear() : year,
                month == null ? now.getMonthValue() : month
        );
        return ApiResponse.success(stats);
    }

    @GetMapping("/logs")
    public ApiResponse<List<EmotionLogResponse>> getMonthlyLogs(
            @AuthenticationPrincipal String loginId,
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) Integer month
    ) {
        LocalDate now = LocalDate.now();
        List<EmotionLogResponse> logs = analysisService.getMonthlyEmotionLogs(
                loginId,
                year == null ? now.getYear() : year,
                month == null ? now.getMonthValue() : month
        );
        return ApiResponse.success(logs);
    }
}
