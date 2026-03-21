package com.chh.watchover.entity;

import com.chh.watchover.dto.user.RegisterRequestDto;
import com.chh.watchover.entity.enums.Gender;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Entity
@Builder
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "users")
public class UserEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;

    @Column(name = "id", nullable = false, length = 50)
    private String loginId;

    @Column(name = "pw", nullable = false, length = 255)
    private String loginPw;

    @Column(name = "email", nullable = false, length = 255)
    private String email;

    @Column(name = "nickname", nullable = false, length = 20)
    private String nickname;

    @Column(name = "gender", nullable = false)
    @Enumerated(EnumType.STRING)
    private Gender gender;

    @Column(name = "total_login", length = 3)
    private int totalLogin;

    @Column(name = "lastLoginAt")
    private LocalDateTime lastLoginAt;

    @Column(name = "point")
    private Long point;

    public void updateLoginTime () {
        this.lastLoginAt = LocalDateTime.now();
    }

}
