package com.chh.watchover.controller;

import com.chh.watchover.dto.ApiResponse;
import com.chh.watchover.dto.user.*;
import com.chh.watchover.service.LoginService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

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
}
