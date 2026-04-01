package com.chh.watchover.domain.community.model.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;

@Getter
public class CommentEditRequestDto {
    @NotBlank(message = "댓글을 작성해 주세요")
    private String content;
}
