package com.chh.watchover.domain.community.model.dto;

import com.chh.watchover.domain.community.model.entity.PostEntity;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;

@Schema(description = "게시물 작성 응답")
@JsonPropertyOrder({"postId", "title", "content", "nickname", "createAt", "updateAt"})
public record PostWriteResponseDto(
        @Schema(description = "게시물 ID") Long postId,
        @Schema(description = "제목") String title,
        @Schema(description = "본문") String content,
        @Schema(description = "작성자 닉네임") String nickname,
        @Schema(description = "작성일") LocalDateTime createdAt,
        @Schema(description = "수정일") LocalDateTime updateAt
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