package com.chh.watchover.domain.community.model.dto;

import com.chh.watchover.domain.community.model.entity.PostEntity;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import io.swagger.v3.oas.annotations.media.Schema;
import org.springframework.data.domain.Page;

import java.util.List;

@Schema(description = "게시물 목록 페이지 응답")
@JsonPropertyOrder({"totalPage", "totalElements", "isFirst", "isLast", "listPost"})
public record ListPostPageResponseDto(
        @Schema(description = "게시물 목록") List<ListPostResponseDto> listPost,
        @Schema(description = "전체 페이지 수") int totalPage,
        @Schema(description = "전체 게시물 수") long totalElements,
        @Schema(description = "첫 번째 페이지 여부") boolean isFirst,
        @Schema(description = "마지막 페이지 여부") boolean isLast
) {
    public static ListPostPageResponseDto from(Page<PostEntity> postPage) {
        return new ListPostPageResponseDto(
                postPage.getContent().stream()
                        .map(ListPostResponseDto::from)
                        .toList(),
                postPage.getTotalPages(),
                postPage.getTotalElements(),
                postPage.isFirst(),
                postPage.isLast()
        );
    }
}