package com.chh.watchover.domain.community.model.dto;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.*;

@Getter
@Builder
@JsonPropertyOrder({"postId","isLike"})
public class LikePostResponseDto {
    private Long postId;
    private Boolean isLike;

    public static LikePostResponseDto of(Long postId, Boolean isLike) {
        return LikePostResponseDto.builder()
                .postId(postId)
                .isLike(isLike)
                .build();
    }
}
