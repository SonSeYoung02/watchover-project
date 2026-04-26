package com.chh.watchover.domain.user.model.dto;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "로그인 응답")
@JsonPropertyOrder({"token"})
public record LoginResponseDto(
        @Schema(description = "JWT 액세스 토큰") String token
) {

    public static LoginResponseDto from(String token) {
        return new LoginResponseDto(token);
    }
}
