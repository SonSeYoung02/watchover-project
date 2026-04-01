package com.chh.watchover.domain.community.model.dto;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.*;

@Getter
@Builder
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@JsonPropertyOrder({"postId","isBookmark"})
public class BookmarkResponseDto {

    private Long postId;
    private boolean isBookmark;

    public static BookmarkResponseDto from(Long postId, boolean isBookmark) {
        return BookmarkResponseDto.builder()
                .postId(postId)
                .isBookmark(isBookmark)
                .build();
    }
}
