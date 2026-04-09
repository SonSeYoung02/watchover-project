package com.chh.watchover.domain.calendar.controller;

import com.chh.watchover.domain.calendar.model.dto.AnalysisResponse;
import com.chh.watchover.domain.calendar.model.dto.EmotionStatResponse;
import com.chh.watchover.domain.user.model.entity.UserEntity;
import com.chh.watchover.domain.user.repository.UserRepository;
import com.chh.watchover.global.common.ApiResponse;
import com.chh.watchover.domain.calendar.service.AnalysisService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/calendar/emotion")
@RequiredArgsConstructor
public class AnalysisController {

    private final AnalysisService analysisService;
    private final UserRepository userRepository;

    // 특정 채팅방의 대화를 분석해서 달력에 저장하는 API
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
