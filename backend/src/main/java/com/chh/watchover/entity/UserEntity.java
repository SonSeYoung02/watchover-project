package com.chh.watchover.entity;

import com.chh.watchover.dto.user.RegisterRequestDto;
import com.chh.watchover.dto.user.UserUpdateRequestDto;
import com.chh.watchover.entity.enums.Gender;
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
                .loginId(dto.getLoginId())
                .loginPw(encodedPassword)
                .email(dto.getEmail())
                .nickname(dto.getNickname())
                .gender(dto.getGender())
                .build();
    }

    @Transactional
    public UserEntity userUpdate(UserUpdateRequestDto dto, String loginPw) {
        boolean isChanged = false;

        if (dto.getLoginPw() != null) {this.loginPw = loginPw;isChanged = true;}
        if (dto.getNickname() != null) {this.nickname = dto.getNickname();isChanged = true;}
        if (dto.getEmail() != null) {this.email = dto.getEmail();isChanged = true;}
        if (dto.getGender() != null) {this.gender = dto.getGender(); isChanged = true;}

        if (isChanged) {this.updatedAt = LocalDateTime.now();}

        return this;
    }
}
