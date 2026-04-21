package com.chh.watchover.domain.community.model.dto;

import com.chh.watchover.domain.community.model.entity.CommentEntity;
import com.chh.watchover.domain.community.model.entity.PostEntity;
import com.chh.watchover.domain.user.model.entity.UserEntity;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

import java.time.LocalDateTime;

@JsonPropertyOrder({"postId", "title", "content", "nickname", "createAt", "updateAt"})
public record CommentWriteResponseDto(
        Long commentId,
        Long postId,
        String content,
        String nickname,
        LocalDateTime createdAt,
        LocalDateTime updateAt
) {
    public static CommentWriteResponseDto of(CommentEntity comment, PostEntity post, UserEntity user) {
        return new CommentWriteResponseDto(
                comment.getCommentId(),
                post.getPostId(),
                comment.getContent(),
                user.getNickname(),
                comment.getCreatedAt(),
                comment.getUpdatedAt()
        );
    }
}