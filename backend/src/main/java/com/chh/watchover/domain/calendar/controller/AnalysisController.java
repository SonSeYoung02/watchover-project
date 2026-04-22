package com.chh.watchover.domain.calendar.controller;

import com.chh.watchover.domain.calendar.model.dto.AnalysisResponse;
import com.chh.watchover.domain.calendar.model.dto.EmotionStatResponse;
import com.chh.watchover.domain.user.model.entity.UserEntity;
import com.chh.watchover.domain.user.repository.UserRepository;
import com.chh.watchover.global.common.ApiResponse;
import com.chh.watchover.domain.calendar.service.AnalysisService;
import io.swagger.v3.oas.annotations.Operation;
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

    /**
     * 특정 채팅방의 대화 내역을 감정 분석하여 달력에 저장한다.
     *
     * @param chatRoomId 감정 분석을 수행할 채팅방의 고유 식별자
     * @return 감정 분석 결과와 저장 시각을 담은 ApiResponse
     */
    // 특정 채팅방의 대화를 분석해서 달력에 저장하는 API
    @Operation(summary = "채팅방 감정 분석 후 달력 저장")
    @PostMapping("/{chatingRoomId}")
    public ApiResponse<AnalysisResponse> analyzeEmotion(
            @PathVariable("chatingRoomId") Long chatRoomId
    ) {
        // 1. 서비스 호출 (결과 문자열을 받음)
        String emotionResult = analysisService.analyzeAndSaveToCalendar(chatRoomId);

        // 2. 결과 데이터를 DTO에 담기
        AnalysisResponse data = new AnalysisResponse(emotionResult, LocalDateTime.now());

        // 3. 공통 포맷(ApiResponse)으로 감싸서 반환
        return ApiResponse.success(data);
    }

    /**
     * 현재 로그인된 사용자의 이번 달 감정 통계를 조회한다.
     *
     * @param loginId JWT에서 추출된 현재 사용자의 로그인 아이디
     * @return 이번 달 감정 유형별 통계 목록을 담은 ApiResponse
     */
    @Operation(summary = "이번 달 감정 통계 조회")
    @GetMapping("/stats")
    public ApiResponse<List<EmotionStatResponse>> getMonthlyStats(
            @AuthenticationPrincipal String loginId) {

        // 1. 현재 날짜 계산
        LocalDate now = LocalDate.now();

        // 3. 서비스 호출
        List<EmotionStatResponse> stats = analysisService.getMonthlyEmotionStats(
                loginId,
                now.getYear(),
                now.getMonthValue()
        );

        return ApiResponse.success(stats);
    }
}
