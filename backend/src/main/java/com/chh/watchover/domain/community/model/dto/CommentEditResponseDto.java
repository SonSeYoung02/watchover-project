package com.chh.watchover.domain.community.model.dto;

import com.chh.watchover.domain.community.model.entity.CommentEntity;
import com.chh.watchover.domain.community.model.entity.PostEntity;
import com.chh.watchover.domain.user.model.entity.UserEntity;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

import java.time.LocalDateTime;

@JsonPropertyOrder({"commentId", "nickname", "postId", "content", "createdAt", "updatedAt"})
public record CommentEditResponseDto(
        Long commentId,
        String nickname,
        Long postId,
        String content,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static CommentEditResponseDto of(CommentEntity comment, UserEntity user, PostEntity post) {
        return new CommentEditResponseDto(
                comment.getCommentId(),
                user.getNickname(),
                post.getPostId(),
                comment.getContent(),
                comment.getCreatedAt(),
                comment.getUpdatedAt()
        );
    }
}