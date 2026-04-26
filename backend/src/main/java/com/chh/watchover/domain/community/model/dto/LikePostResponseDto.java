package com.chh.watchover.domain.community.model.dto;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "좋아요 토글 응답")
@JsonPropertyOrder({"postId", "isLike"})
public record LikePostResponseDto(
        @Schema(description = "게시물 ID") Long postId,
        @Schema(description = "좋아요 여부") Boolean isLike
) {

    public static LikePostResponseDto of(Long postId, Boolean isLike) {
        return new LikePostResponseDto(postId, isLike);
    }
}