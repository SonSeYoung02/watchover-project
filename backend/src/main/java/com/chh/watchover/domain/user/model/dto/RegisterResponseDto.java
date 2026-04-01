package com.chh.watchover.domain.user.model.dto;

import com.chh.watchover.domain.user.model.entity.UserEntity;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@JsonPropertyOrder({"userId","nickname"})
public class RegisterResponseDto {

    private String userId;
    private String nickname;

    public static RegisterResponseDto from(UserEntity saveUser) {
        return RegisterResponseDto.builder()
                .userId(saveUser.getLoginId())
                .nickname(saveUser.getNickname())
                .build();
    }
}
