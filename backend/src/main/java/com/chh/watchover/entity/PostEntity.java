package com.chh.watchover.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "posts")
public class PostEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long postId;

    @Column(name = "post_id", nullable = false, length = 20)
    private String userId;

    @Column(name = "title", nullable = false, length = 100)
    private String title;

    @Column(name = "content", nullable = false)
    private String content;

    @Column(name = "like_count", length = 4)
    private int likeCount;
}
