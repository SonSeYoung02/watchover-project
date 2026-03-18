package com.chh.watchover.dto.user;

import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class LoginRequestDto {

    private String loginId;
    private String loginPw;
    private LocalDateTime localDateTime;

}
