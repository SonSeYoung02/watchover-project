package com.chh.watchover.domain.community.model.dto;

import com.chh.watchover.domain.community.model.entity.BookmarkEntity;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import org.springframework.data.domain.Page;

import java.util.List;

@JsonPropertyOrder({"totalPage", "totalElements", "isFirst", "isLast", "listPost"})
public record BookmarkListPageResponseDto(
        List<ListPostResponseDto> listPost,
        int totalPage,
        long totalElements,
        boolean isFirst,
        boolean isLast
) {
    public static BookmarkListPageResponseDto from(Page<BookmarkEntity> bookmarkPage) {
        return new BookmarkListPageResponseDto(
                bookmarkPage.getContent().stream()
                        .map(b -> ListPostResponseDto.from(b.getPost()))
                        .toList(),
                bookmarkPage.getTotalPages(),
                bookmarkPage.getTotalElements(),
                bookmarkPage.isFirst(),
                bookmarkPage.isLast()
        );
    }
}
