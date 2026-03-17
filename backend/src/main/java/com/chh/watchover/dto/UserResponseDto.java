package com.chh.watchover.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Builder
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class UserResponseDto {
    private String loginId;
    private String email;
    private String nickname;
    private int total_login;
    private LocalDateTime lastLoginAt;
    private Long point;
}
