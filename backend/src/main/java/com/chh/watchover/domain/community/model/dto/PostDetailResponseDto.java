package com.chh.watchover.domain.community.model.dto;

import com.chh.watchover.domain.community.model.entity.PostEntity;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;
import java.util.List;

@Schema(description = "게시물 상세 응답")
@JsonPropertyOrder({"postId", "authorId", "authorNickname", "title", "content", "likeCount", "createdAt", "updatedAt", "comments"})
public record PostDetailResponseDto(
        @Schema(description = "게시물 ID") Long postId,
        @Schema(description = "작성자 ID") Long authorId,
        @Schema(description = "작성자 닉네임") String authorNickname,
        @Schema(description = "제목") String title,
        @Schema(description = "본문") String content,
        @Schema(description = "좋아요 수") int likeCount,
        @Schema(description = "작성일") LocalDateTime createdAt,
        @Schema(description = "수정일") LocalDateTime updatedAt,
        @Schema(description = "댓글 목록") List<ListCommentResponseDto> comments
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