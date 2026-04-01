package com.chh.watchover.domain.community.model.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class CommentWriteRequestDto {

    @NotBlank(message = "댓글을 작성해주세요.")
    private String content;

}
