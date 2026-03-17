package com.chh.watchover.entity;

import com.chh.watchover.entity.enums.Type;
import jakarta.persistence.*;

@Entity
@Table(name = "character_profile")
public class CharacterProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long characterProfileId;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "type", nullable = false)
    @Enumerated(EnumType.STRING)
    private Type type;
}
