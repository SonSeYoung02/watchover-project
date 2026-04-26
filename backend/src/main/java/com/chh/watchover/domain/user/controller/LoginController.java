package com.chh.watchover.domain.user.controller;

import com.chh.watchover.domain.user.model.dto.*;
import com.chh.watchover.global.common.ApiResponse;
import com.chh.watchover.domain.user.service.LoginService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@Tag(name = "User", description = "회원 관리 API")
@RestController
@RequestMapping("/api/user")
public class LoginController {

    private final LoginService loginService;

    @Autowired
    public LoginController(LoginService loginService) {
        this.loginService = loginService;
    }

    @Operation(summary = "회원가입", description = "아이디·이메일 중복 검사 후 신규 유저를 생성합니다.")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "회원가입 성공"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "유효성 검사 실패"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "409", description = "아이디 또는 이메일 중복")
    })
    @PostMapping("/register")
    public ApiResponse<RegisterResponseDto> userId(@Valid @RequestBody RegisterRequestDto userRegisterRequestDto) {
        return ApiResponse.success(loginService.userRegister(userRegisterRequestDto));
    }

    @Operation(summary = "유저 카드 조회", description = "로그인한 유저의 닉네임과 캐릭터 이미지를 반환합니다.")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "조회 성공"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "인증 실패")
    })
    @GetMapping("/search/me")
    public ApiResponse<SearchResponseDto> userSearch(Principal principal) {
        String loginId = principal.getName();
        return ApiResponse.success(loginService.userSearch(loginId));
    }

    @Operation(summary = "로그인", description = "loginId·loginPw 검증 후 JWT 토큰을 발급합니다.")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "로그인 성공 및 JWT 발급"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "유효성 검사 실패"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "아이디 또는 비밀번호 불일치")
    })
    @PostMapping("/login")
    public ApiResponse<LoginResponseDto> userLogin(@Valid @RequestBody LoginRequestDto loginRequestDto) {
        return ApiResponse.success(loginService.userLogin(loginRequestDto));
    }

    @Operation(summary = "회원 탈퇴", description = "현재 로그인된 유저의 계정을 삭제합니다.")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "탈퇴 성공"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "인증 실패")
    })
    @DeleteMapping("/delete")
    public ApiResponse<UserDeleteResponseDto> userDelete(Principal principal) {
        String loginId = principal.getName();
        return ApiResponse.success(loginService.userDelete(loginId));
    }

    @Operation(summary = "회원 정보 수정", description = "현재 로그인된 유저의 비밀번호 등 정보를 수정합니다.")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "수정 성공"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "유효성 검사 실패"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "인증 실패")
    })
    @PatchMapping("/update")
    public ApiResponse<UserUpdateResponseDto> userUpdate(@RequestBody UserUpdateRequestDto dto, Principal principal) {
        String logId = principal.getName();
        return ApiResponse.success(loginService.userUpdate(dto, logId));
    }
}