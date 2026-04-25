package com.chh.watchover.domain.user.model.dto;

import com.chh.watchover.domain.user.model.entity.UserEntity;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

import java.time.LocalDateTime;

@JsonPropertyOrder({"loginId", "email", "nickname", "total_login", "lastLoginAt", "point"})
public record SearchResponseDto(String loginId, String email, String nickname, LocalDateTime createAt) {

    public static SearchResponseDto from(UserEntity user) {
        return new SearchResponseDto(user.getLoginId(), user.getEmail(), user.getNickname(), user.getCreatedAt());
    }
}
