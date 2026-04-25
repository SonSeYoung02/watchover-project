package com.chh.watchover.domain.community.model.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;

@Schema(description = "게시물 수정 요청")
public record PostUpdateRequestDto(
        @Schema(description = "수정할 제목", example = "수정된 제목")
        @NotBlank(message = "제목은 공백으로 제출할 수 없습니다.")
        String title,

        @Schema(description = "수정할 본문", example = "수정된 내용입니다.")
        @NotBlank(message = "본문은 공백으로 제출할 수 없습니다.")
        String content
) {}