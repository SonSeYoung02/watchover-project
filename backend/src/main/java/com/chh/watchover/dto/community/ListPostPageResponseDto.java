package com.chh.watchover.dto.community;

import com.chh.watchover.entity.PostEntity;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.*;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.stream.Collectors;

@Getter
@Builder
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@JsonPropertyOrder({"totalPage","totalElements","isFirst","isLast","listPost"})
public class ListPostPageResponseDto {

    private List<ListPostResponseDto> listPost;
    private int totalPage;
    private long totalElements;
    private boolean isFirst;
    private boolean isLast;

    public static ListPostPageResponseDto from(Page<PostEntity> postPage) {
        return ListPostPageResponseDto.builder()
                .listPost(postPage.getContent().stream()
                        .map(ListPostResponseDto::from)
                        .collect(Collectors.toList()))
                .totalPage(postPage.getTotalPages())
                .totalElements(postPage.getTotalElements())
                .isFirst(postPage.isFirst())
                .isLast(postPage.isLast())
                .build();
    }
}
