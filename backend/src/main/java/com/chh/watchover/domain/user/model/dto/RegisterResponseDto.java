package com.chh.watchover.domain.user.model.dto;

import com.chh.watchover.domain.user.model.entity.UserEntity;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "회원가입 응답")
@JsonPropertyOrder({"userId", "nickname"})
public record RegisterResponseDto(
        @Schema(description = "로그인 아이디") String userId,
        @Schema(description = "닉네임") String nickname
) {

    public static RegisterResponseDto from(UserEntity saveUser) {
        return new RegisterResponseDto(saveUser.getLoginId(), saveUser.getNickname());
    }
}
