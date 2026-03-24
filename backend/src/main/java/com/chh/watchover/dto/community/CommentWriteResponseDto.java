package com.chh.watchover.dto.community;

import com.chh.watchover.entity.CommentEntity;
import com.chh.watchover.entity.UserEntity;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Builder
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@JsonPropertyOrder({"postId","title","content","nickname","createAt","updateAt"})
public class CommentWriteResponseDto {

    private Long commentId;
    private Long postId;
    private String content;
    private String nickname;
    private LocalDateTime createdAt;
    private LocalDateTime updateAt;

    public static CommentWriteResponseDto of(CommentEntity comment, UserEntity user) {
        return CommentWriteResponseDto.builder()
                .commentId(comment.getCommentId())
                .postId(comment.getPostId())
                .content(comment.getContent())
                .nickname(user.getNickname())
                .createdAt(comment.getCreatedAt())
                .updateAt(comment.getUpdatedAt())
                .build();
    }

}
