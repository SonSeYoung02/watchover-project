package com.chh.watchover.domain.community.model.dto;

import jakarta.validation.constraints.NotBlank;

public record CommentEditRequestDto(
        @NotBlank(message = "댓글을 작성해 주세요") String content
) {}