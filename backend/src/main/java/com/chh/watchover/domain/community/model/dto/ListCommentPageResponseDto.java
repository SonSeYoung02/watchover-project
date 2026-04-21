package com.chh.watchover.domain.community.model.dto;

import com.chh.watchover.domain.community.model.entity.CommentEntity;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import org.springframework.data.domain.Page;

import java.util.List;

@JsonPropertyOrder({"totalPage", "totalElements", "listComment", "isFirst", "isLast"})
public record ListCommentPageResponseDto(
        List<ListCommentResponseDto> listComment,
        int totalPage,
        long totalElements,
        boolean isFirst,
        boolean isLast
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