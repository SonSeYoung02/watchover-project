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

    /*
    =====================================================================
    1. 유저 생성
    - 유저를 생성하는 메소드
    =====================================================================
    */

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
    @PatchMapping("/update")
    public ApiResponse<UserUpdateResponseDto> userUpdate(@RequestBody UserUpdateRequestDto dto, Principal principal) {
        String logId = principal.getName();
        return loginService.userUpdate(dto,logId);
    }
}
