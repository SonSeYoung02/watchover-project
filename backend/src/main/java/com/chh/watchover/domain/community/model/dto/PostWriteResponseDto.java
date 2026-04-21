package com.chh.watchover.domain.community.model.dto;

import com.chh.watchover.domain.community.model.entity.PostEntity;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

import java.time.LocalDateTime;

@JsonPropertyOrder({"postId", "title", "content", "nickname", "createAt", "updateAt"})
public record PostWriteResponseDto(
        Long postId,
        String title,
        String content,
        String nickname,
        LocalDateTime createdAt,
        LocalDateTime updateAt
) {
    public static PostWriteResponseDto from(PostEntity post, String nickname) {
        return new PostWriteResponseDto(
                post.getPostId(),
                post.getTitle(),
                post.getContent(),
                nickname,
                post.getCreatedAt(),
                post.getUpdatedAt()
        );
    }
}