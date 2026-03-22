package com.chh.watchover.dto.community;

import com.chh.watchover.entity.CommentEntity;
import com.chh.watchover.entity.UserEntity;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
@JsonPropertyOrder({"commentId","postId","nickname","createdAt","updateAt"})
public class CommentWriteResponseDto {

    private Long commentId;
    private Long postId;
    private String nickname;
    private LocalDateTime createdAt;
    private LocalDateTime updateAt;

    public static CommentWriteResponseDto of(CommentEntity comment, UserEntity user) {
        return CommentWriteResponseDto.builder()
                .commentId(comment.getCommentId())
                .postId(comment.getPostId())
                .nickname(user.getNickname())
                .createdAt(comment.getCreatedAt())
                .updateAt(comment.getUpdatedAt())
                .build();
    }

}
