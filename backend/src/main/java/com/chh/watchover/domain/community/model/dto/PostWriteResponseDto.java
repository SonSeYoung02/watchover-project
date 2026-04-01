package com.chh.watchover.domain.community.model.dto;

import com.chh.watchover.domain.community.model.entity.PostEntity;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Builder
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@JsonPropertyOrder({"postId","title","content","nickname","createAt","updateAt"})
public class PostWriteResponseDto {

    private Long postId;
    private String title;
    private String content;
    private String nickname;
    private LocalDateTime createdAt;
    private LocalDateTime updateAt;

    public static PostWriteResponseDto from(PostEntity post, String nickname) {
        return PostWriteResponseDto.builder()
                .postId(post.getPostId())
                .title(post.getTitle())
                .content(post.getContent())
                .nickname(nickname)
                .createdAt(post.getCreatedAt())
                .updateAt(post.getUpdatedAt())
                .build();
    }

}
