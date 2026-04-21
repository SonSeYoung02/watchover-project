package com.chh.watchover.domain.community.model.dto;

import jakarta.validation.constraints.NotBlank;

public record CommentWriteRequestDto(
        @NotBlank(message = "댓글을 작성해주세요.") String content
) {}