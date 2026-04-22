package com.chh.watchover.domain.user.controller;

import com.chh.watchover.domain.user.model.dto.*;
import com.chh.watchover.global.common.ApiResponse;
import com.chh.watchover.domain.user.service.LoginService;
import io.swagger.v3.oas.annotations.Operation;
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

    /*
    =====================================================================
    1. 유저 생성
    - 유저를 생성하는 메소드
    =====================================================================
    */

    /**
     * 새로운 회원을 등록한다.
     *
     * @param userRegisterRequestDto 회원가입에 필요한 사용자 정보 DTO
     * @return 등록된 회원 정보를 담은 ApiResponse
     */
    @Operation(summary = "회원가입")
    @PostMapping("/register")
    public ApiResponse<RegisterResponseDto> userId(@Valid @RequestBody RegisterRequestDto userRegisterRequestDto) {
        return loginService.userRegister(userRegisterRequestDto);
    }

    /*
    =====================================================================
    2. 유저 조회
    - 유저를 userId를 통해서 찾는 메소드
    =====================================================================
    */
    /**
     * userId를 기반으로 특정 회원 정보를 조회한다.
     *
     * @param userId 조회할 회원의 고유 식별자
     * @return 조회된 회원 정보를 담은 ApiResponse
     */
    @Operation(summary = "유저 조회")
    @GetMapping("/search/{userId}")
    public ApiResponse<SearchResponseDto> userSearch(@PathVariable Long userId) {
        return loginService.userSearch(userId);
    }

    /*
    =====================================================================
    3. 유저 로그인
    - 유저의 정보를 확인하는 메소드
    =====================================================================
    */
    /**
     * 사용자 자격증명을 검증하고 로그인 처리한다.
     *
     * @param loginRequestDto 로그인에 필요한 아이디 및 비밀번호 DTO
     * @return 로그인 결과(토큰 등)를 담은 ApiResponse
     */
    @Operation(summary = "로그인")
    @PostMapping("/login")
    public ApiResponse<LoginResponseDto> userLogin(@Valid @RequestBody LoginRequestDto loginRequestDto) {
        return loginService.userLogin(loginRequestDto);
    }

    /*
    =====================================================================
    4. 유저 삭제
    - 유저의 계정을 삭제하는 기능
    =====================================================================
    */
    /**
     * 현재 로그인된 회원의 계정을 삭제한다.
     *
     * @param principal 현재 인증된 사용자 정보 (Spring Security 제공)
     * @return 탈퇴 처리 결과를 담은 ApiResponse
     */
    @Operation(summary = "회원 탈퇴")
    @DeleteMapping("/delete")
    public ApiResponse<UserDeleteResponseDto> userDelete(Principal principal) {
        String loginId = principal.getName();
        return loginService.userDelete(loginId);
    }

    /*
    =====================================================================
    5. 유저 정보 수정
    - 유저의 정보를 수정하는 기능
    =====================================================================
    */
    /**
     * 현재 로그인된 회원의 정보를 수정한다.
     *
     * @param dto       수정할 회원 정보 DTO
     * @param principal 현재 인증된 사용자 정보 (Spring Security 제공)
     * @return 수정된 회원 정보를 담은 ApiResponse
     */
    @Operation(summary = "회원 정보 수정")
    @PatchMapping("/update")
    public ApiResponse<UserUpdateResponseDto> userUpdate(@RequestBody UserUpdateRequestDto dto, Principal principal) {
        String logId = principal.getName();
        return loginService.userUpdate(dto,logId);
    }
}
