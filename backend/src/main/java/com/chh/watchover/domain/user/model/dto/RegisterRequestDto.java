package com.chh.watchover.domain.user.model.dto;

import com.chh.watchover.domain.user.model.type.Gender;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;

@Schema(description = "회원가입 요청")
@Getter
public class RegisterRequestDto {

    @Schema(description = "로그인 아이디", example = "user123")
    @NotBlank(message = "아이디는 필수 입력값입니다.")
    private String loginId;

    @Schema(description = "비밀번호 (8~16자, 영문 대소문자·숫자·특수문자)", example = "Pass1234!")
    @NotBlank(message = "비밀번호는 필수 입력값입니다.")
    @Pattern(regexp = "^[a-zA-Z0-9!@#$%^&*]{8,16}$", message = "비밀번호는 8~16자의 영문 대소문자, 숫자, 특수문자로 이루어져야 합니다.")
    private String loginPw;

    @Schema(description = "이메일 주소", example = "user@example.com")
    @NotBlank(message = "이메일은 필수 입력값입니다.")
    @Email(message = "이메일 형식이 아닙니다.")
    private String email;

    @Schema(description = "닉네임", example = "홍길동")
    @NotBlank(message = "별명은  필수 입력값입니다.")
    private String nickname;

    @Schema(description = "성별 (MALE / FEMALE)", example = "MALE")
    @NotNull(message = "성별은  필수 입력값입니다.")
    private Gender gender;
}