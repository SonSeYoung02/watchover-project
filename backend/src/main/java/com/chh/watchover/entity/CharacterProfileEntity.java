package com.chh.watchover.entity;

import com.chh.watchover.entity.enums.Type;
import jakarta.persistence.*;

@Entity
@Table(name = "character_profile")
public class CharacterProfileEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long characterProfileId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;

    @Column(name = "image", length = 255)
    private String image = null;
}
