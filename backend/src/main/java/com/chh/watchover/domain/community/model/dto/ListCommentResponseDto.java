package com.chh.watchover.domain.community.model.dto;

import com.chh.watchover.domain.community.model.entity.CommentEntity;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;

@Schema(description = "댓글 목록 항목")
@JsonPropertyOrder({"commentId", "nickname", "postId", "content", "createdAt", "updatedAt"})
public record ListCommentResponseDto(
        @Schema(description = "댓글 ID") Long commentId,
        @Schema(description = "작성자 닉네임") String nickname,
        @Schema(description = "게시물 ID") Long postId,
        @Schema(description = "댓글 내용") String content,
        @Schema(description = "작성일") LocalDateTime createdAt,
        @Schema(description = "수정일") LocalDateTime updatedAt
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