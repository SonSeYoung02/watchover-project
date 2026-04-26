package com.chh.watchover.domain.user.model.dto;

import com.chh.watchover.domain.user.model.entity.UserEntity;
import com.chh.watchover.domain.user.model.type.Gender;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "회원 정보 수정 응답")
@JsonPropertyOrder({"isSuccess", "email", "nickname", "gender"})
public record UserUpdateResponseDto(
        @Schema(description = "수정 성공 여부") boolean isSuccess,
        @Schema(description = "이메일") String email,
        @Schema(description = "닉네임") String nickname,
        @Schema(description = "성별") Gender gender
) {

    public static UserUpdateResponseDto from(UserEntity updateUser) {
        return new UserUpdateResponseDto(true, updateUser.getEmail(), updateUser.getNickname(), updateUser.getGender());
    }
}
