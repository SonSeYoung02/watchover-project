package com.chh.watchover.dto.user;

import com.chh.watchover.entity.UserEntity;
import com.chh.watchover.entity.enums.Gender;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.*;

@Getter
@Builder
@AllArgsConstructor(access = AccessLevel.PROTECTED)
@NoArgsConstructor(access = AccessLevel.PRIVATE)
@JsonPropertyOrder({"isSuccess","email","nickname","gender"})
public class UserUpdateResponseDto {
    private boolean isSuccess;
    private String email;
    private String nickname;
    private Gender gender;

    public static UserUpdateResponseDto from(UserEntity updateUser) {
        return UserUpdateResponseDto.builder()
                .isSuccess(true)
                .email(updateUser.getEmail())
                .nickname(updateUser.getNickname())
                .gender(updateUser.getGender())
                .build();
    }

}
