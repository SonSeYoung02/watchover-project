package com.chh.watchover.domain.user.model.dto;

import com.chh.watchover.domain.user.model.entity.UserEntity;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;

@Schema(description = "유저 조회 응답")
@JsonPropertyOrder({"loginId", "email", "nickname", "createAt"})
public record SearchResponseDto(
        @Schema(description = "로그인 아이디") String loginId,
        @Schema(description = "이메일") String email,
        @Schema(description = "닉네임") String nickname,
        @Schema(description = "가입일") LocalDateTime createAt
) {

    public static SearchResponseDto from(UserEntity user) {
        return new SearchResponseDto(user.getLoginId(), user.getEmail(), user.getNickname(), user.getCreatedAt());
    }
}
