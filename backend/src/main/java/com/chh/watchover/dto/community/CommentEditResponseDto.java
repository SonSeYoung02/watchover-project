package com.chh.watchover.dto.community;

import com.chh.watchover.entity.CommentEntity;
import com.chh.watchover.entity.PostEntity;
import com.chh.watchover.entity.UserEntity;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
@JsonPropertyOrder({"commentId","nickname","postId","content","createdAt","updatedAt"})
public class CommentEditResponseDto {
    private Long commentId;
    private String nickname;
    private Long postId;
    private String content;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static CommentEditResponseDto of(CommentEntity comment, UserEntity user, PostEntity post) {
        return CommentEditResponseDto.builder()
                .commentId(comment.getCommentId())
                .nickname(user.getNickname())
                .postId(post.getPostId())
                .content(comment.getContent())
                .createdAt(comment.getCreatedAt())
                .updatedAt(comment.getUpdatedAt())
                .build();
    }
}
