package com.chh.watchover.dto.community;

import com.chh.watchover.entity.PostEntity;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.*;

@Getter
@Builder
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@JsonPropertyOrder({"postId"})
public class PostWriteResponseDto {

    private Long postId;

    public static PostWriteResponseDto from(PostEntity post) {
        return PostWriteResponseDto.builder()
                .postId(post.getPostId())
                .build();
    }

}
