package com.chh.watchover.domain.community.model.dto;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "북마크 토글 응답")
@JsonPropertyOrder({"postId", "isBookmark"})
public record BookmarkResponseDto(
        @Schema(description = "게시물 ID") Long postId,
        @Schema(description = "북마크 여부") boolean isBookmark
) {

    public static BookmarkResponseDto from(Long postId, boolean isBookmark) {
        return new BookmarkResponseDto(postId, isBookmark);
    }
}