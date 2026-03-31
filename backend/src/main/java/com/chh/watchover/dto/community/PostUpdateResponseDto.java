package com.chh.watchover.dto.community;

import com.chh.watchover.entity.PostEntity;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Builder
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@JsonPropertyOrder({"postId","title","content","nickname","createAt","updateAt"})
public class PostUpdateResponseDto {

    private Long postId;
    private String title;
    private String content;
    private String nickname;
    private LocalDateTime createAt;
    private LocalDateTime updateAt;

    public static PostUpdateResponseDto of(PostEntity post, String nickname) {
        return PostUpdateResponseDto.builder()
                .postId(post.getPostId())
                .title(post.getTitle())
                .content(post.getContent())
                .nickname(nickname)
                .createAt(post.getCreatedAt())
                .updateAt(post.getUpdatedAt())
                .build();
    }

}
