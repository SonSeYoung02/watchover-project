package com.chh.watchover.domain.community.model.dto;

import com.chh.watchover.domain.community.model.entity.CommentEntity;
import com.chh.watchover.domain.community.model.entity.PostEntity;
import com.chh.watchover.domain.user.model.entity.UserEntity;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;

@Schema(description = "댓글 작성 응답")
@JsonPropertyOrder({"postId", "title", "content", "nickname", "createAt", "updateAt"})
public record CommentWriteResponseDto(
        @Schema(description = "댓글 ID") Long commentId,
        @Schema(description = "게시물 ID") Long postId,
        @Schema(description = "댓글 내용") String content,
        @Schema(description = "작성자 닉네임") String nickname,
        @Schema(description = "작성일") LocalDateTime createdAt,
        @Schema(description = "수정일") LocalDateTime updateAt
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