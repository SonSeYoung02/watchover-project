package com.chh.watchover.dto.user;

import com.chh.watchover.entity.UserEntity;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
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
