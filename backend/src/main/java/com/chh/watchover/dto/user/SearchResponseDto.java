package com.chh.watchover.dto.user;

import com.chh.watchover.entity.UserEntity;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Builder
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@JsonPropertyOrder({"loginId","email","nickname","total_login","lastLoginAt","point"})
public class SearchResponseDto {

    private String loginId;
    private String email;
    private String nickname;
    private LocalDateTime createAt;

    public static SearchResponseDto from(UserEntity user) {
        return SearchResponseDto.builder()
                .loginId(user.getLoginId())
                .email(user.getEmail())
                .nickname(user.getNickname())
                .createAt(user.getCreatedAt())
                .build();
    }

}
