package com.chh.watchover.domain.user.model.dto;

import com.chh.watchover.domain.user.model.type.Gender;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;

@Schema(description = "회원 정보 수정 요청")
@JsonPropertyOrder({"loginPw", "email", "nickname", "gender"})
public record UserUpdateRequestDto(
        @Schema(description = "새 비밀번호 (8~16자, 영문 대소문자·숫자·특수문자)", example = "NewPass1!")
        @NotBlank(message = "비밀번호를 입력하세요")
        @Pattern(regexp = "^[a-zA-Z0-9!@#$%^&*]{8,16}$", message = "비밀번호는 8~16자의 영문 대소문자, 숫자, 특수문자로 이루어져야 합니다.")
        String loginPw,

        @Schema(description = "새 이메일 주소", example = "new@example.com")
        @NotBlank(message = "이메일을 입력하세요")
        @Email(message = "이메일 형식이 아닙니다.")
        String email,

        @Schema(description = "새 닉네임", example = "새닉네임")
        @NotBlank(message = "별명을 입력하세요")
        String nickname,

        @Schema(description = "성별 (MALE / FEMALE)", example = "FEMALE")
        @NotNull(message = "성별을 입력하세요")
        Gender gender
) {}
