package com.chh.watchover.domain.user.model.dto;

import com.chh.watchover.domain.user.model.entity.UserEntity;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

@JsonPropertyOrder({"userId", "nickname"})
public record RegisterResponseDto(String userId, String nickname) {

    public static RegisterResponseDto from(UserEntity saveUser) {
        return new RegisterResponseDto(saveUser.getLoginId(), saveUser.getNickname());
    }
}
