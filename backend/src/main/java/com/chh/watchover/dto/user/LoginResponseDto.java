package com.chh.watchover.dto.user;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class LoginResponseDto {

    private String token;

    public static LoginResponseDto from(String token) {
        return LoginResponseDto.builder()
                .token(token)
                .build();
    }
}
