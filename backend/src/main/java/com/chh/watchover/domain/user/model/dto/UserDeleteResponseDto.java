package com.chh.watchover.domain.user.model.dto;

import com.chh.watchover.domain.user.model.entity.UserEntity;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "회원 탈퇴 응답")
@JsonPropertyOrder({"userId"})
public record UserDeleteResponseDto(
        @Schema(description = "탈퇴된 유저 ID") Long userId
) {

    public static UserDeleteResponseDto from(UserEntity user) {
        return new UserDeleteResponseDto(user.getUserId());
    }
}
