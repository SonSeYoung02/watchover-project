package com.chh.watchover.domain.community.model.dto;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;

@JsonPropertyOrder({"postId", "isBookmark"})
public record BookmarkResponseDto(Long postId, boolean isBookmark) {

    public static BookmarkResponseDto from(Long postId, boolean isBookmark) {
        return new BookmarkResponseDto(postId, isBookmark);
    }
}