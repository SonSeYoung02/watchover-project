package com.chh.watchover.domain.user.model.entity;

import com.chh.watchover.domain.user.model.dto.RegisterRequestDto;
import com.chh.watchover.domain.user.model.dto.UserUpdateRequestDto;
import com.chh.watchover.domain.user.model.type.Gender;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Getter
@Entity
@Builder
@EntityListeners(AuditingEntityListener.class)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "users")
public class UserEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
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

    @CreatedDate
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public static UserEntity of(RegisterRequestDto dto, String encodedPassword) {
        return UserEntity.builder()
                .loginId(dto.loginId())
                .loginPw(encodedPassword)
                .email(dto.email())
                .nickname(dto.nickname())
                .gender(dto.gender())
                .build();
    }

    @Transactional
    public UserEntity userUpdate(UserUpdateRequestDto dto, String loginPw) {
        boolean isChanged = false;

        if (dto.loginPw() != null) {this.loginPw = loginPw; isChanged = true;}
        if (dto.nickname() != null) {this.nickname = dto.nickname(); isChanged = true;}
        if (dto.email() != null) {this.email = dto.email(); isChanged = true;}
        if (dto.gender() != null) {this.gender = dto.gender(); isChanged = true;}

        if (isChanged) {this.updatedAt = LocalDateTime.now();}

        return this;
    }
}
