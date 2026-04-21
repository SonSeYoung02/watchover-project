package com.chh.watchover.domain.community.model.dto;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;

@JsonPropertyOrder({"postId", "isLike"})
public record LikePostResponseDto(Long postId, Boolean isLike) {

    public static LikePostResponseDto of(Long postId, Boolean isLike) {
        return new LikePostResponseDto(postId, isLike);
    }
}