package com.chh.watchover.dto.user;

import com.chh.watchover.entity.UserEntity;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Builder
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class SearchResponseDto {

    private String loginId;
    private String email;
    private String nickname;
    private int total_login;
    private LocalDateTime lastLoginAt;
    private Long point;

    public static SearchResponseDto from(UserEntity user) {
        return SearchResponseDto.builder()
                .loginId(user.getLoginId())
                .email(user.getEmail())
                .nickname(user.getNickname())
                .total_login(user.getTotalLogin())
                .lastLoginAt(user.getLastLoginAt())
                .point(user.getPoint())
                .build();
    }

}
