package com.chh.watchover.domain.community.model.dto;

import com.chh.watchover.domain.community.model.entity.CommentEntity;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

import java.time.LocalDateTime;

@JsonPropertyOrder({"commentId", "nickname", "postId", "content", "createdAt", "updatedAt"})
public record ListCommentResponseDto(
        Long commentId,
        String nickname,
        Long postId,
        String content,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static ListCommentResponseDto from(CommentEntity comment) {
        return new ListCommentResponseDto(
                comment.getCommentId(),
                comment.getUser().getNickname(),
                comment.getPost().getPostId(),
                comment.getContent(),
                comment.getCreatedAt(),
                comment.getUpdatedAt()
        );
    }
}