package com.chh.watchover.domain.community.model.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;

@Schema(description = "댓글 작성 요청")
public record CommentWriteRequestDto(
        @Schema(description = "댓글 내용", example = "공감합니다!")
        @NotBlank(message = "댓글을 작성해주세요.")
        String content
) {}