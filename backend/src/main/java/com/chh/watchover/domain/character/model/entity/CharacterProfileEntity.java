package com.chh.watchover.domain.character.model.entity;

import com.chh.watchover.domain.user.model.entity.UserEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "character_profile")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class CharacterProfileEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    // name 속성을 필드명 'id'와 명시적으로 다르게 지정하려 할 때 충돌이 발생합니다.
    // 필드명을 단순하게 'id'로 유지하고, 아래 설정을 추가하는 것이 가장 안전합니다.
    @Column(name = "character_profile_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;

    @Column(name = "image", length = 255)
    private String image;
}
