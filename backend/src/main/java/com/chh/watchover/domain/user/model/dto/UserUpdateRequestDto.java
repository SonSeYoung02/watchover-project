package com.chh.watchover.domain.user.model.dto;

import com.chh.watchover.domain.user.model.type.Gender;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;

@Getter
@JsonPropertyOrder({"loginPw","email","nickname","gender"})
public class UserUpdateRequestDto {
    @NotBlank(message = "비밀번호를 입력하세요")
    @Pattern(regexp = "^[a-zA-Z0-9!@#$%^&*]{8,16}$", message = "비밀번호는 8~16자의 영문 대소문자, 숫자, 특수문자로 이루어져야 합니다.")
    private String loginPw;

    @NotBlank(message = "이메일을 입력하세요")
    @Email(message = "이메일 형식이 아닙니다.")
    private String email;

    @NotBlank(message = "별명을 입력하세요")
    private String nickname;

    @NotBlank(message = "성별을 입력하세요")
    private Gender gender;
}
