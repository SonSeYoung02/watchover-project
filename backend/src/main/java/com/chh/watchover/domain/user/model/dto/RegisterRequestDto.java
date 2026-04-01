package com.chh.watchover.domain.user.model.dto;

import com.chh.watchover.domain.user.model.type.Gender;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;

@Getter
public class RegisterRequestDto {
    @NotBlank(message = "아이디는 필수 입력값입니다.")
    private String loginId;

    @NotBlank(message = "비밀번호는 필수 입력값입니다.")
    @Pattern(regexp = "^[a-zA-Z0-9!@#$%^&*]{8,16}$", message = "비밀번호는 8~16자의 영문 대소문자, 숫자, 특수문자로 이루어져야 합니다.")
    private String loginPw;

    @NotBlank(message = "이메일은 필수 입력값입니다.")
    @Email(message = "이메일 형식이 아닙니다.")
    private String email;

    @NotBlank(message = "별명은  필수 입력값입니다.")
    private String nickname;

    @NotBlank(message = "성별은  필수 입력값입니다.")
    private Gender gender;

}
