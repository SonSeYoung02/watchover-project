package com.chh.watchover.domain.community.model.dto;

import com.chh.watchover.domain.community.model.entity.PostEntity;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

import java.time.LocalDateTime;

@JsonPropertyOrder({"postId", "title", "content", "nickname", "createAt", "updateAt"})
public record PostUpdateResponseDto(
        Long postId,
        String title,
        String content,
        String nickname,
        LocalDateTime createAt,
        LocalDateTime updateAt
) {
    public static PostUpdateResponseDto of(PostEntity post, String nickname) {
        return new PostUpdateResponseDto(
                post.getPostId(),
                post.getTitle(),
                post.getContent(),
                nickname,
                post.getCreatedAt(),
                post.getUpdatedAt()
        );
    }
}