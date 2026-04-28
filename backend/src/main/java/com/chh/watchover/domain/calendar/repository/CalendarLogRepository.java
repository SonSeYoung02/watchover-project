package com.chh.watchover.domain.calendar.repository;

import com.chh.watchover.domain.calendar.model.dto.EmotionStatResponse;
import com.chh.watchover.domain.calendar.model.entity.CalendarLogEntity;
import com.chh.watchover.domain.user.model.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface CalendarLogRepository extends JpaRepository<CalendarLogEntity, Long> {
    @Query("SELECT new com.chh.watchover.domain.calendar.model.dto.EmotionStatResponse(c.emotion, COUNT(c)) " +
            "FROM CalendarLogEntity c " +
            "WHERE c.user = :user " + // 객체 지향적으로 UserEntity를 직접 비교
            "AND YEAR(c.createdAt) = :year " +
            "AND MONTH(c.createdAt) = :month " +
            "GROUP BY c.emotion")
    List<EmotionStatResponse> getMonthlyStats(
            @Param("user") UserEntity user,
            @Param("year") int year,
            @Param("month") int month);

    Optional<CalendarLogEntity> findFirstByUserAndCreatedAtBetween(
            UserEntity user,
            LocalDateTime start,
            LocalDateTime end);

    List<CalendarLogEntity> findAllByUserAndCreatedAtBetweenOrderByCreatedAtAsc(
            UserEntity user,
            LocalDateTime start,
            LocalDateTime end);
}
