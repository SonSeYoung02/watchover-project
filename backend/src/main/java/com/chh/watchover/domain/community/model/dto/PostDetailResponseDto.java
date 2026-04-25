package com.chh.watchover.domain.community.model.dto;

import com.chh.watchover.domain.community.model.entity.PostEntity;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

import java.time.LocalDateTime;
import java.util.List;

@JsonPropertyOrder({"postId", "authorId", "authorNickname", "title", "content", "likeCount", "createdAt", "updatedAt", "comments"})
public record PostDetailResponseDto(
        Long postId,
        Long authorId,
        String authorNickname,
        String title,
        String content,
        int likeCount,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        List<ListCommentResponseDto> comments
) {
    public static PostDetailResponseDto of(PostEntity post, List<ListCommentResponseDto> comments) {
        return new PostDetailResponseDto(
                post.getPostId(),
                post.getUser().getUserId(),
                post.getUser().getNickname(),
                post.getTitle(),
                post.getContent(),
                post.getLikeCount(),
                post.getCreatedAt(),
                post.getUpdatedAt(),
                comments
        );
    }
}