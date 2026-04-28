package com.chh.watchover.domain.user.model.dto;

import com.chh.watchover.domain.user.model.entity.UserEntity;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "유저 조회 응답")
@JsonPropertyOrder({"nickname", "loginId", "email", "characterImage"})
public record SearchResponseDto(
        @Schema(description = "닉네임") String nickname,
        @Schema(description = "로그인 ID") String loginId,
        @Schema(description = "이메일") String email,
        @Schema(description = "캐릭터 이미지 URL") String characterImage
) {

    public static SearchResponseDto from(UserEntity user, String characterImage) {
        return new SearchResponseDto(
                user.getNickname(),
                user.getLoginId(),
                user.getEmail(),
                characterImage
        );
    }
}
