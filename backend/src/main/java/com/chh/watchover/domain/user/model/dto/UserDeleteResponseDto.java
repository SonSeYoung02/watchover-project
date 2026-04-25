package com.chh.watchover.domain.user.model.dto;

import com.chh.watchover.domain.user.model.entity.UserEntity;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

@JsonPropertyOrder({"userId"})
public record UserDeleteResponseDto(Long userId) {

    public static UserDeleteResponseDto from(UserEntity user) {
        return new UserDeleteResponseDto(user.getUserId());
    }
}
