package com.chh.watchover.domain.community.model.dto;

import com.chh.watchover.domain.community.model.entity.CommentEntity;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Builder
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@JsonPropertyOrder({"commentId","nickname","postId","content","createdAt","updatedAt"})
public class ListCommentResponseDto {

    private Long commentId;
    private String nickname;
    private Long postId;
    private String content;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static ListCommentResponseDto from(CommentEntity comment) {
        return ListCommentResponseDto.builder()
                .commentId(comment.getCommentId())
                .nickname(comment.getUser().getNickname())
                .postId(comment.getPost().getPostId())
                .content(comment.getContent())
                .createdAt(comment.getCreatedAt())
                .updatedAt(comment.getUpdatedAt())
                .build();
    }

}
