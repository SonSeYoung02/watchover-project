package com.chh.watchover.domain.community.model.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;

@Schema(description = "댓글 수정 요청")
public record CommentEditRequestDto(
        @Schema(description = "수정할 댓글 내용", example = "수정된 댓글입니다.")
        @NotBlank(message = "댓글을 작성해 주세요")
        String content
) {}