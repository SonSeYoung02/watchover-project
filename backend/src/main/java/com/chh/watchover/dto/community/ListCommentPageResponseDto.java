package com.chh.watchover.dto.community;

import com.chh.watchover.entity.CommentEntity;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.*;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.stream.Collectors;

@Getter
@Builder
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@JsonPropertyOrder({"totalPage","totalElements","listComment","isFirst","isLast"})
public class ListCommentPageResponseDto {

    private List<ListCommentResponseDto> listComment;
    private int totalPage;
    private long totalElements;
    private boolean isFirst;
    private boolean isLast;

    public static ListCommentPageResponseDto from(Page<CommentEntity> commentPage) {
        return ListCommentPageResponseDto.builder()
                .listComment(commentPage.getContent().stream()
                        .map(ListCommentResponseDto::from)
                        .collect(Collectors.toList()))
                .totalPage(commentPage.getTotalPages())
                .totalElements(commentPage.getTotalElements())
                .isFirst(commentPage.isFirst())
                .isLast(commentPage.isLast())
                .build();
    }
}
