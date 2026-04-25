package com.chh.watchover.domain.community.model.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Schema(description = "게시물 작성 요청")
public record PostWriteRequestDto(
        @Schema(description = "게시물 제목 (최대 100자)", example = "오늘의 일기")
        @NotBlank(message = "제목이 비었습니다.")
        @Size(max = 100, message = "제목은 100자 이하로 입력해주세요.")
        String title,

        @Schema(description = "게시물 본문", example = "오늘은 기분이 좋았다.")
        @NotBlank(message = "본문이 비었습니다.")
        String content
) {}