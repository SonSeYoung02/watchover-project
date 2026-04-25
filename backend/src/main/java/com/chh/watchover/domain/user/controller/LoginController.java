package com.chh.watchover.domain.user.controller;

import com.chh.watchover.domain.user.model.dto.*;
import com.chh.watchover.global.common.ApiResponse;
import com.chh.watchover.domain.user.service.LoginService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/user")
public class LoginController {

    private final LoginService loginService;

    @Autowired
    public LoginController(LoginService loginService) {
        this.loginService = loginService;
    }

    /**
     * 회원가입 API.
     * 아이디·이메일 중복 검사 후 신규 유저를 생성합니다.
     *
     * @param userRegisterRequestDto 회원가입 요청 DTO (loginId, loginPw, email 등)
     * @return 생성된 유저 정보를 담은 표준 응답
     */
    @PostMapping("/register")
    public ApiResponse<RegisterResponseDto> userId(@Valid @RequestBody RegisterRequestDto userRegisterRequestDto) {
        return ApiResponse.success(loginService.userRegister(userRegisterRequestDto));
    }

    /**
     * 보인 정보 조회 API.
     * 로그인한 유저의 정보를 조회합니다.
     *
     * @return 유저 정보를 담은 표준 응답
     */
    @GetMapping("/search/me")
    public ApiResponse<SearchResponseDto> userSearch(Principal principal) {
        String loginId = principal.getName();
        return ApiResponse.success(loginService.userSearch(loginId));
    }

    /**
     * 로그인 API.
     * loginId·loginPw 검증 후 JWT 토큰을 발급합니다.
     *
     * @param loginRequestDto 로그인 요청 DTO (loginId, loginPw)
     * @return 발급된 JWT 토큰을 담은 표준 응답
     */
    @PostMapping("/login")
    public ApiResponse<LoginResponseDto> userLogin(@Valid @RequestBody LoginRequestDto loginRequestDto) {
        return ApiResponse.success(loginService.userLogin(loginRequestDto));
    }

    /**
     * 회원 탈퇴 API.
     * 현재 로그인된 유저의 계정을 삭제합니다.
     *
     * @param principal Spring Security가 주입하는 현재 인증 유저 정보
     * @return 삭제된 유저 정보를 담은 표준 응답
     */
    @DeleteMapping("/delete")
    public ApiResponse<UserDeleteResponseDto> userDelete(Principal principal) {
        String loginId = principal.getName();
        return ApiResponse.success(loginService.userDelete(loginId));
    }

    /**
     * 유저 정보 수정 API.
     * 현재 로그인된 유저의 비밀번호 등 정보를 수정합니다.
     *
     * @param dto       수정할 유저 정보 DTO
     * @param principal Spring Security가 주입하는 현재 인증 유저 정보
     * @return 수정된 유저 정보를 담은 표준 응답
     */
    @PatchMapping("/update")
    public ApiResponse<UserUpdateResponseDto> userUpdate(@RequestBody UserUpdateRequestDto dto, Principal principal) {
        String logId = principal.getName();
        return ApiResponse.success(loginService.userUpdate(dto, logId));
    }
}