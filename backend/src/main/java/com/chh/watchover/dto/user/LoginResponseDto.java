package com.chh.watchover.dto.user;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@JsonPropertyOrder({"token"})
public class LoginResponseDto {

    private String token;

    public static LoginResponseDto from(String token) {
        return LoginResponseDto.builder()
                .token(token)
                .build();
    }
}
