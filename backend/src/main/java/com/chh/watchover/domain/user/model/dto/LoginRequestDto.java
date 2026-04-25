package com.chh.watchover.domain.user.model.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;

import java.time.LocalDateTime;

@Schema(description = "로그인 요청")
@Getter
public class LoginRequestDto {

    @Schema(description = "로그인 아이디", example = "user123")
    @NotBlank(message = "아이디는 필수 입력값 입니다.")
    private String loginId;

    @Schema(description = "비밀번호", example = "Pass1234!")
    @NotBlank(message = "비밀번호는 필수 입력값 입니다.")
    private String loginPw;

    private LocalDateTime localDateTime;
}