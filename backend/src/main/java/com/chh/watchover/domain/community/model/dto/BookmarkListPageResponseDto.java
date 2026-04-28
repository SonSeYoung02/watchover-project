package com.chh.watchover.domain.community.model.dto;

import com.chh.watchover.domain.community.model.entity.BookmarkEntity;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import io.swagger.v3.oas.annotations.media.Schema;
import org.springframework.data.domain.Page;

import java.util.List;

@Schema(description = "북마크 게시물 목록 응답")
@JsonPropertyOrder({"totalPage", "totalElements", "isFirst", "isLast", "listPost"})
public record BookmarkListPageResponseDto(
        @Schema(description = "북마크한 게시물 목록") List<ListPostResponseDto> listPost,
        @Schema(description = "전체 페이지 수") int totalPage,
        @Schema(description = "전체 게시물 수") long totalElements,
        @Schema(description = "첫 번째 페이지 여부") boolean isFirst,
        @Schema(description = "마지막 페이지 여부") boolean isLast
) {
    public static BookmarkListPageResponseDto from(Page<BookmarkEntity> bookmarkPage) {
        return new BookmarkListPageResponseDto(
                bookmarkPage.getContent().stream()
                        .map(BookmarkEntity::getPost)
                        .filter(p -> p != null)
                        .map(ListPostResponseDto::from)
                        .toList(),
                bookmarkPage.getTotalPages(),
                bookmarkPage.getTotalElements(),
                bookmarkPage.isFirst(),
                bookmarkPage.isLast()
        );
    }
}
