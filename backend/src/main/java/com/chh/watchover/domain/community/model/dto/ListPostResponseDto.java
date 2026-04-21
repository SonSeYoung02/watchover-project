package com.chh.watchover.domain.community.model.dto;

import com.chh.watchover.domain.community.model.entity.PostEntity;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

import java.time.LocalDateTime;

@JsonPropertyOrder({"postId", "title", "content", "likeCount", "createdAt", "updatedAt"})
public record ListPostResponseDto(
        Long postId,
        String title,
        String content,
        int likeCount,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static ListPostResponseDto from(PostEntity post) {
        return new ListPostResponseDto(
                post.getPostId(),
                post.getTitle(),
                post.getContent(),
                post.getLikeCount(),
                post.getCreatedAt(),
                post.getUpdatedAt()
        );
    }
}