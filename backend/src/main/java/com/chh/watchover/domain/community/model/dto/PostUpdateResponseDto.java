package com.chh.watchover.domain.community.model.dto;

import com.chh.watchover.domain.community.model.entity.PostEntity;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;

@Schema(description = "게시물 수정 응답")
@JsonPropertyOrder({"postId", "title", "content", "nickname", "createAt", "updateAt"})
public record PostUpdateResponseDto(
        @Schema(description = "게시물 ID") Long postId,
        @Schema(description = "수정된 제목") String title,
        @Schema(description = "수정된 본문") String content,
        @Schema(description = "작성자 닉네임") String nickname,
        @Schema(description = "작성일") LocalDateTime createAt,
        @Schema(description = "수정일") LocalDateTime updateAt
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