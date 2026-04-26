package com.chh.watchover.domain.attendance.model.entity;

import com.chh.watchover.domain.user.model.entity.UserEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "attendance", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"user_id", "check_in_date"})
})
@Getter
@Builder
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class AttendanceEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "attendance_id")
    private Long attendanceId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;

    @Column(name = "check_in_date", nullable = false)
    private LocalDate checkInDate;

    @Column(name = "timezone", nullable = false, length = 50)
    private String timezone;

    public static AttendanceEntity of(UserEntity user, LocalDate checkInDate, String timezone) {
        return AttendanceEntity.builder()
                .user(user)
                .checkInDate(checkInDate)
                .timezone(timezone)
                .build();
    }
}
