package com.chh.watchover.domain.community.model.dto;

import com.chh.watchover.domain.community.model.entity.PostEntity;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;

@Schema(description = "게시물 목록 항목")
@JsonPropertyOrder({"postId", "title", "content", "likeCount", "createdAt", "updatedAt"})
public record ListPostResponseDto(
        @Schema(description = "게시물 ID") Long postId,
        @Schema(description = "제목") String title,
        @Schema(description = "본문") String content,
        @Schema(description = "좋아요 수") int likeCount,
        @Schema(description = "작성일") LocalDateTime createdAt,
        @Schema(description = "수정일") LocalDateTime updatedAt
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