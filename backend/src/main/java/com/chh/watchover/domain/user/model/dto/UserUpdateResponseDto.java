package com.chh.watchover.domain.user.model.dto;

import com.chh.watchover.domain.user.model.entity.UserEntity;
import com.chh.watchover.domain.user.model.type.Gender;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

@JsonPropertyOrder({"isSuccess", "email", "nickname", "gender"})
public record UserUpdateResponseDto(boolean isSuccess, String email, String nickname, Gender gender) {

    public static UserUpdateResponseDto from(UserEntity updateUser) {
        return new UserUpdateResponseDto(true, updateUser.getEmail(), updateUser.getNickname(), updateUser.getGender());
    }
}
