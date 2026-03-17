package com.chh.watchover.dto;

import com.chh.watchover.entity.enums.Gender;
import lombok.Getter;

@Getter
public class UserRequestDto {
    private String loginId;
    private String loginPw;
    private String email;
    private String nickname;
    private Gender gender;
}
