package com.chh.watchover.dto.user;

import com.chh.watchover.entity.UserEntity;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.*;

@Getter
@Builder
@AllArgsConstructor(access = AccessLevel.PROTECTED)
@NoArgsConstructor(access = AccessLevel.PRIVATE)
@JsonPropertyOrder({"userId"})
public class UserDeleteResponseDto {
    private Long userId;

    public static UserDeleteResponseDto from(UserEntity user) {
        return UserDeleteResponseDto.builder()
                .userId(user.getUserId())
                .build();
    }
}
