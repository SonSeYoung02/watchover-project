package com.chh.watchover.dto.user;

import com.chh.watchover.entity.enums.Gender;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;

@Getter
public class RegisterRequestDto {

    private String loginId;
    @Pattern(regexp = "^[a-zA-Z0-9!@#$%^&*]{8,16}$", message = "비밀번호는 8~16자의 영문 대소문자, 숫자, 특수문자로 이루어져야 합니다.")
    private String loginPw;
    @Email(message = "이메일 형식이 아닙니다.")
    private String email;
    private String nickname;
    private Gender gender;

}
