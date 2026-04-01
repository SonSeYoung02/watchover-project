package com.chh.watchover.domain.community.model.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "banner")
public class BannerEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long bannerId;

    @Column(name = "content", nullable = false)
    private String content;

    @Column(name = "is_activate", nullable = false)
    private Boolean isActivate;
}
