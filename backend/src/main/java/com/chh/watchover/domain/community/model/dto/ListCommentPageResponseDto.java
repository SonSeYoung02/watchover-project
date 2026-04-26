package com.chh.watchover.domain.community.model.dto;

import com.chh.watchover.domain.community.model.entity.CommentEntity;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import io.swagger.v3.oas.annotations.media.Schema;
import org.springframework.data.domain.Page;

import java.util.List;

@Schema(description = "댓글 목록 페이지 응답")
@JsonPropertyOrder({"totalPage", "totalElements", "listComment", "isFirst", "isLast"})
public record ListCommentPageResponseDto(
        @Schema(description = "댓글 목록") List<ListCommentResponseDto> listComment,
        @Schema(description = "전체 페이지 수") int totalPage,
        @Schema(description = "전체 댓글 수") long totalElements,
        @Schema(description = "첫 번째 페이지 여부") boolean isFirst,
        @Schema(description = "마지막 페이지 여부") boolean isLast
) {
    public static ListCommentPageResponseDto from(Page<CommentEntity> commentPage) {
        return new ListCommentPageResponseDto(
                commentPage.getContent().stream()
                        .map(ListCommentResponseDto::from)
                        .toList(),
                commentPage.getTotalPages(),
                commentPage.getTotalElements(),
                commentPage.isFirst(),
                commentPage.isLast()
        );
    }
}