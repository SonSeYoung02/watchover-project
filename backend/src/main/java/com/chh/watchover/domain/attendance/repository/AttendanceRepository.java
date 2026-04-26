package com.chh.watchover.domain.attendance.repository;

import com.chh.watchover.domain.attendance.model.entity.AttendanceEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceRepository extends JpaRepository<AttendanceEntity, Long> {

    Optional<AttendanceEntity> findByUser_UserIdAndCheckInDate(Long userId, LocalDate checkInDate);

    List<AttendanceEntity> findAllByUser_UserIdOrderByCheckInDateDesc(Long userId);

    long countByUser_UserId(Long userId);
}
