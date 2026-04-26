package com.chh.watchover.domain.attendance.controller;

import com.chh.watchover.domain.attendance.model.dto.CheckInRequestDto;
import com.chh.watchover.domain.attendance.model.dto.CheckInResponseDto;
import com.chh.watchover.domain.attendance.model.dto.StreakResponseDto;
import com.chh.watchover.domain.attendance.service.AttendanceService;
import com.chh.watchover.global.common.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@Tag(name = "Attendance", description = "출석 체크 및 스트릭 API")
@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {

    private final AttendanceService attendanceService;

    @Autowired
    public AttendanceController(AttendanceService attendanceService) {
        this.attendanceService = attendanceService;
    }

    @Operation(summary = "출석 체크", description = "오늘 출석을 체크합니다. 하루 1회만 가능하며 연속 출석 스트릭이 계산됩니다.")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "출석 체크 성공"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "인증 실패"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "409", description = "오늘 이미 출석 체크함")
    })
    @PostMapping("/check-in")
    public ApiResponse<CheckInResponseDto> checkIn(
            @Valid @RequestBody CheckInRequestDto request,
            Principal principal) {
        return ApiResponse.success(attendanceService.checkIn(principal.getName(), request.timezone()));
    }

    @Operation(summary = "스트릭 조회", description = "현재 연속 출석 일수, 최대 스트릭, 전체 출석 일수를 조회합니다.")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "조회 성공"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "인증 실패")
    })
    @GetMapping("/streak")
    public ApiResponse<StreakResponseDto> getStreak(Principal principal) {
        return ApiResponse.success(attendanceService.getStreak(principal.getName()));
    }
}
