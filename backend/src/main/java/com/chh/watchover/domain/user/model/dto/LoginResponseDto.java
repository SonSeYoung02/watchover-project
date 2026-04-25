package com.chh.watchover.domain.user.model.dto;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;

@JsonPropertyOrder({"token"})
public record LoginResponseDto(String token) {

    public static LoginResponseDto from(String token) {
        return new LoginResponseDto(token);
    }
}
