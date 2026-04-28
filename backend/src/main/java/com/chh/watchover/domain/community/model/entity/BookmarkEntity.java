package com.chh.watchover.domain.community.model.entity;

import com.chh.watchover.domain.user.model.entity.UserEntity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Entity
@Table(
        name = "bookmark",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "unq_user_post",
                        columnNames = {"user_id","post_id"}
                )
        }
)
@Getter
@Builder
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class BookmarkEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long bookmarkId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private PostEntity post;

    public static BookmarkEntity createBookmark(UserEntity user, PostEntity post) {
        return BookmarkEntity.builder()
                .user(user)
                .post(post)
                .build();
    }
}
