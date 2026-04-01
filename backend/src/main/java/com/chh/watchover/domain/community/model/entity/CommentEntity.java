package com.chh.watchover.domain.community.model.entity;

import com.chh.watchover.domain.community.model.dto.CommentEditRequestDto;
import com.chh.watchover.domain.community.model.dto.CommentWriteRequestDto;
import com.chh.watchover.domain.user.model.entity.UserEntity;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Getter
@Builder
@Table(name = "comments")
@EntityListeners(AuditingEntityListener.class)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class CommentEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long commentId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private UserEntity user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id", nullable = false)
    private PostEntity post;

    @Column(name = "content", nullable = false, columnDefinition = "TEXT")
    private String content;

    @CreatedDate
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public static CommentEntity of(CommentWriteRequestDto dto, UserEntity user, PostEntity post) {
        return CommentEntity.builder()
                .user(user)
                .post(post)
                .content(dto.getContent())
                .build();
    }

    public void updateComment(CommentEditRequestDto dto) {
        if (content != null) {
            this.content = dto.getContent();
            System.out.println(dto.getContent());
            this.updatedAt = LocalDateTime.now();
        }
    }
}
