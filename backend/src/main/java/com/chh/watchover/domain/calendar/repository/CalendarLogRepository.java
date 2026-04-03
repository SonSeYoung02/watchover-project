package com.chh.watchover.domain.calendar.repository;

import com.chh.watchover.domain.calendar.model.entity.CalendarLogEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CalendarLogRepository extends JpaRepository<CalendarLogEntity, Long> {
}
