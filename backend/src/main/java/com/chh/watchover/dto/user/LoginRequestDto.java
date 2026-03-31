package com.chh.watchover.dto.user;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class LoginRequestDto {

    @NotBlank(message = "아이디는 필수 입력값 입니다.")
    private String loginId;

    @NotBlank(message = "비밀번호는 필수 입력값 입니다.")
    private String loginPw;

    private LocalDateTime localDateTime;

}
