package com.chh.watchover.controller;

import com.chh.watchover.dto.UserRequestDto;
import com.chh.watchover.dto.UserResponseDto;
import com.chh.watchover.service.LoginService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ui.Model;
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
    - 반환값으로 userId를 반환(유저 고유 아이디)
    =====================================================================
    */

    @PostMapping("/register")
    public Long userId(@RequestBody UserRequestDto userRequestDto) {
        return loginService.userRegister(userRequestDto);
    }

    /*
    =====================================================================
    2. 유저 조회
    - 유저를 userId를 통해서 찾는 메소드
    - 유저 객체를 반환(DTO를 통해서 반환)
    =====================================================================
    */

    @GetMapping("/search/{userId}")
    public UserResponseDto userSearch(@PathVariable Long userId) {
        return loginService.userSearch(userId);
    }
}
