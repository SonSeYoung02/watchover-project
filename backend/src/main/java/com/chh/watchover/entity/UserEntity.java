package com.chh.watchover.entity;

import com.chh.watchover.dto.user.RegisterRequestDto;
import com.chh.watchover.entity.enums.Gender;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

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
    @Column(name = "create_at")
    private LocalDateTime createAt;

    public static UserEntity of(RegisterRequestDto dto, String encodedPassword) {
        return UserEntity.builder()
                .loginId(dto.getLoginId())
                .loginPw(encodedPassword)
                .email(dto.getEmail())
                .nickname(dto.getNickname())
                .gender(dto.getGender())
                .build();
    }
}
