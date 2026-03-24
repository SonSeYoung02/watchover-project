package com.chh.watchover.entity;

import com.chh.watchover.dto.community.PostWriteRequestDto;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Getter
@Builder
@Entity
@EntityListeners(AuditingEntityListener.class)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "posts")
public class PostEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long postId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private UserEntity user;

    @Column(name = "title", nullable = false, length = 100)
    private String title;

    @Column(name = "content", nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(name = "like_count")
    private int likeCount = 0;

    @CreatedDate
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    public static PostEntity of(PostWriteRequestDto dto, UserEntity user) {
        return PostEntity.builder()
                .user(user)
                .title(dto.getTitle())
                .content(dto.getContent())
                .build();
    }

    public void updatePost(String title, String content) {
        if (title != null) {this.title = title;}
        if (content != null) {this.content = content;}
        if (title != null || content != null) {this.updatedAt = LocalDateTime.now();}
    }

}
