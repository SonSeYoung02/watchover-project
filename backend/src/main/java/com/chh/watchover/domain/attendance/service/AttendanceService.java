package com.chh.watchover.domain.attendance.service;

import com.chh.watchover.domain.attendance.model.dto.CheckInResponseDto;
import com.chh.watchover.domain.attendance.model.dto.StreakResponseDto;
import com.chh.watchover.domain.attendance.model.entity.AttendanceEntity;
import com.chh.watchover.domain.attendance.repository.AttendanceRepository;
import com.chh.watchover.domain.user.model.entity.UserEntity;
import com.chh.watchover.domain.user.repository.UserRepository;
import com.chh.watchover.global.exception.CustomException;
import com.chh.watchover.global.exception.code.ErrorCode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;

@Service
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final UserRepository userRepository;

    @Autowired
    public AttendanceService(AttendanceRepository attendanceRepository, UserRepository userRepository) {
        this.attendanceRepository = attendanceRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public CheckInResponseDto checkIn(String loginId, String timezone) {
        UserEntity user = userRepository.findByLoginId(loginId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        ZoneId zoneId = parseZone(timezone);
        LocalDate today = LocalDate.now(zoneId);

        if (attendanceRepository.findByUser_UserIdAndCheckInDate(user.getUserId(), today).isPresent()) {
            throw new CustomException(ErrorCode.ALREADY_CHECKED_IN);
        }

        attendanceRepository.save(AttendanceEntity.of(user, today, timezone));

        List<LocalDate> dates = attendanceRepository
                .findAllByUser_UserIdOrderByCheckInDateDesc(user.getUserId())
                .stream().map(AttendanceEntity::getCheckInDate).toList();

        int streak = calculateCurrentStreak(dates, today);
        long total = attendanceRepository.countByUser_UserId(user.getUserId());

        return CheckInResponseDto.of(today, streak, total);
    }

    public StreakResponseDto getStreak(String loginId) {
        UserEntity user = userRepository.findByLoginId(loginId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        List<LocalDate> dates = attendanceRepository
                .findAllByUser_UserIdOrderByCheckInDateDesc(user.getUserId())
                .stream().map(AttendanceEntity::getCheckInDate).toList();

        if (dates.isEmpty()) {
            return StreakResponseDto.of(0, 0, 0L, null);
        }

        LocalDate today = LocalDate.now();
        int currentStreak = calculateCurrentStreak(dates, today);
        int maxStreak = calculateMaxStreak(dates);
        long total = attendanceRepository.countByUser_UserId(user.getUserId());

        return StreakResponseDto.of(currentStreak, maxStreak, total, dates.get(0));
    }

    private int calculateCurrentStreak(List<LocalDate> sortedDesc, LocalDate today) {
        if (sortedDesc.isEmpty()) return 0;

        LocalDate cursor = sortedDesc.get(0);
        // 마지막 출석이 오늘 또는 어제가 아니면 스트릭 종료
        if (!cursor.equals(today) && !cursor.equals(today.minusDays(1))) return 0;

        int streak = 1;
        for (int i = 1; i < sortedDesc.size(); i++) {
            if (sortedDesc.get(i).equals(cursor.minusDays(1))) {
                streak++;
                cursor = sortedDesc.get(i);
            } else {
                break;
            }
        }
        return streak;
    }

    private int calculateMaxStreak(List<LocalDate> sortedDesc) {
        if (sortedDesc.isEmpty()) return 0;

        int max = 1, current = 1;
        for (int i = 1; i < sortedDesc.size(); i++) {
            if (sortedDesc.get(i).equals(sortedDesc.get(i - 1).minusDays(1))) {
                current++;
                max = Math.max(max, current);
            } else {
                current = 1;
            }
        }
        return max;
    }

    private ZoneId parseZone(String timezone) {
        try {
            return ZoneId.of(timezone);
        } catch (Exception e) {
            return ZoneId.of("Asia/Seoul");
        }
    }
}
