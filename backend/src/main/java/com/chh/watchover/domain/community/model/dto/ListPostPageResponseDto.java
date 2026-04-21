package com.chh.watchover.domain.community.model.dto;

import com.chh.watchover.domain.community.model.entity.PostEntity;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import org.springframework.data.domain.Page;

import java.util.List;

@JsonPropertyOrder({"totalPage", "totalElements", "isFirst", "isLast", "listPost"})
public record ListPostPageResponseDto(
        List<ListPostResponseDto> listPost,
        int totalPage,
        long totalElements,
        boolean isFirst,
        boolean isLast
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