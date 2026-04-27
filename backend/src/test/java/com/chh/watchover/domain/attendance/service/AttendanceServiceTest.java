package com.chh.watchover.domain.attendance.service;

import com.chh.watchover.domain.attendance.model.dto.CheckInResponseDto;
import com.chh.watchover.domain.attendance.model.dto.StreakResponseDto;
import com.chh.watchover.domain.attendance.model.entity.AttendanceEntity;
import com.chh.watchover.domain.attendance.repository.AttendanceRepository;
import com.chh.watchover.domain.user.model.entity.UserEntity;
import com.chh.watchover.domain.user.repository.UserRepository;
import com.chh.watchover.global.exception.CustomException;
import com.chh.watchover.global.exception.code.ErrorCode;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AttendanceServiceTest {

    @Mock
    private AttendanceRepository attendanceRepository;
    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private AttendanceService attendanceService;

    // --- checkIn ---

    @Test
    void checkIn_throwsCustomException_whenUserNotFound() {
        when(userRepository.findByLoginId("ghost")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> attendanceService.checkIn("ghost", "Asia/Seoul"))
                .isInstanceOf(CustomException.class)
                .satisfies(ex -> assertThat(((CustomException) ex).getErrorCode()).isEqualTo(ErrorCode.USER_NOT_FOUND));
    }

    @Test
    void checkIn_throwsCustomException_whenAlreadyCheckedInToday() {
        UserEntity user = mock(UserEntity.class);
        when(user.getUserId()).thenReturn(1L);
        when(userRepository.findByLoginId("user1")).thenReturn(Optional.of(user));

        when(attendanceRepository.findByUser_UserIdAndCheckInDate(eq(1L), any(LocalDate.class)))
                .thenReturn(Optional.of(mock(AttendanceEntity.class)));

        assertThatThrownBy(() -> attendanceService.checkIn("user1", "Asia/Seoul"))
                .isInstanceOf(CustomException.class)
                .satisfies(ex -> assertThat(((CustomException) ex).getErrorCode()).isEqualTo(ErrorCode.ALREADY_CHECKED_IN));

        verify(attendanceRepository, never()).save(any());
    }

    @Test
    void checkIn_savesAttendance_andReturnsResponse_onFirstCheckInOfDay() {
        UserEntity user = mock(UserEntity.class);
        when(user.getUserId()).thenReturn(1L);
        when(userRepository.findByLoginId("user1")).thenReturn(Optional.of(user));

        when(attendanceRepository.findByUser_UserIdAndCheckInDate(eq(1L), any(LocalDate.class)))
                .thenReturn(Optional.empty());

        LocalDate today = LocalDate.now();
        AttendanceEntity savedRecord = AttendanceEntity.of(user, today, "Asia/Seoul");
        when(attendanceRepository.findAllByUser_UserIdOrderByCheckInDateDesc(1L))
                .thenReturn(List.of(savedRecord));
        when(attendanceRepository.countByUser_UserId(1L)).thenReturn(1L);

        CheckInResponseDto response = attendanceService.checkIn("user1", "Asia/Seoul");

        verify(attendanceRepository).save(any(AttendanceEntity.class));
        assertThat(response.checkInDate()).isEqualTo(today);
        assertThat(response.totalCheckIns()).isEqualTo(1L);
        assertThat(response.currentStreak()).isEqualTo(1);
    }

    @Test
    void checkIn_fallsBackToSeoulZone_whenTimezoneIsInvalid() {
        UserEntity user = mock(UserEntity.class);
        when(user.getUserId()).thenReturn(1L);
        when(userRepository.findByLoginId("user1")).thenReturn(Optional.of(user));

        when(attendanceRepository.findByUser_UserIdAndCheckInDate(eq(1L), any(LocalDate.class)))
                .thenReturn(Optional.empty());
        when(attendanceRepository.findAllByUser_UserIdOrderByCheckInDateDesc(1L)).thenReturn(List.of());
        when(attendanceRepository.countByUser_UserId(1L)).thenReturn(1L);

        // invalid timezone must not blow up — service catches and falls back to Asia/Seoul
        CheckInResponseDto response = attendanceService.checkIn("user1", "INVALID/ZONE");

        assertThat(response).isNotNull();
    }

    // --- getStreak ---

    @Test
    void getStreak_throwsCustomException_whenUserNotFound() {
        when(userRepository.findByLoginId("ghost")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> attendanceService.getStreak("ghost"))
                .isInstanceOf(CustomException.class)
                .satisfies(ex -> assertThat(((CustomException) ex).getErrorCode()).isEqualTo(ErrorCode.USER_NOT_FOUND));
    }

    @Test
    void getStreak_returnsZeroesAndNullDate_whenNoAttendanceRecords() {
        UserEntity user = mock(UserEntity.class);
        when(user.getUserId()).thenReturn(1L);
        when(userRepository.findByLoginId("user1")).thenReturn(Optional.of(user));
        when(attendanceRepository.findAllByUser_UserIdOrderByCheckInDateDesc(1L)).thenReturn(List.of());

        StreakResponseDto response = attendanceService.getStreak("user1");

        assertThat(response.currentStreak()).isEqualTo(0);
        assertThat(response.maxStreak()).isEqualTo(0);
        assertThat(response.totalCheckIns()).isEqualTo(0L);
        assertThat(response.lastCheckInDate()).isNull();
    }

    @Test
    void getStreak_returnsCurrentStreakOfOne_whenOnlyTodayCheckedIn() {
        UserEntity user = mock(UserEntity.class);
        when(user.getUserId()).thenReturn(1L);
        when(userRepository.findByLoginId("user1")).thenReturn(Optional.of(user));

        LocalDate today = LocalDate.now();
        AttendanceEntity rec = attendanceEntityWithDate(today);
        when(attendanceRepository.findAllByUser_UserIdOrderByCheckInDateDesc(1L)).thenReturn(List.of(rec));
        when(attendanceRepository.countByUser_UserId(1L)).thenReturn(1L);

        StreakResponseDto response = attendanceService.getStreak("user1");

        assertThat(response.currentStreak()).isEqualTo(1);
        assertThat(response.lastCheckInDate()).isEqualTo(today);
    }

    @Test
    void getStreak_returnsConsecutiveStreak_whenDaysAreContiguous() {
        UserEntity user = mock(UserEntity.class);
        when(user.getUserId()).thenReturn(1L);
        when(userRepository.findByLoginId("user1")).thenReturn(Optional.of(user));

        LocalDate today = LocalDate.now();
        List<AttendanceEntity> records = List.of(
                attendanceEntityWithDate(today),
                attendanceEntityWithDate(today.minusDays(1)),
                attendanceEntityWithDate(today.minusDays(2))
        );
        when(attendanceRepository.findAllByUser_UserIdOrderByCheckInDateDesc(1L)).thenReturn(records);
        when(attendanceRepository.countByUser_UserId(1L)).thenReturn(3L);

        StreakResponseDto response = attendanceService.getStreak("user1");

        assertThat(response.currentStreak()).isEqualTo(3);
        assertThat(response.maxStreak()).isEqualTo(3);
        assertThat(response.totalCheckIns()).isEqualTo(3L);
    }

    @Test
    void getStreak_returnsZeroCurrentStreak_whenLastCheckInWasMoreThanYesterdayAgo() {
        UserEntity user = mock(UserEntity.class);
        when(user.getUserId()).thenReturn(1L);
        when(userRepository.findByLoginId("user1")).thenReturn(Optional.of(user));

        LocalDate threeDaysAgo = LocalDate.now().minusDays(3);
        AttendanceEntity oldRecord = attendanceEntityWithDate(threeDaysAgo);
        when(attendanceRepository.findAllByUser_UserIdOrderByCheckInDateDesc(1L))
                .thenReturn(List.of(oldRecord));
        when(attendanceRepository.countByUser_UserId(1L)).thenReturn(1L);

        StreakResponseDto response = attendanceService.getStreak("user1");

        assertThat(response.currentStreak()).isEqualTo(0);
        assertThat(response.maxStreak()).isEqualTo(1);
    }

    @Test
    void getStreak_tracksMaxStreakCorrectly_whenStreakWasBrokenAndRestarted() {
        UserEntity user = mock(UserEntity.class);
        when(user.getUserId()).thenReturn(1L);
        when(userRepository.findByLoginId("user1")).thenReturn(Optional.of(user));

        LocalDate today = LocalDate.now();
        // today + yesterday = current streak 2, old streak 3 days before the gap
        List<AttendanceEntity> records = List.of(
                attendanceEntityWithDate(today),
                attendanceEntityWithDate(today.minusDays(1)),
                attendanceEntityWithDate(today.minusDays(5)),
                attendanceEntityWithDate(today.minusDays(6)),
                attendanceEntityWithDate(today.minusDays(7))
        );
        when(attendanceRepository.findAllByUser_UserIdOrderByCheckInDateDesc(1L)).thenReturn(records);
        when(attendanceRepository.countByUser_UserId(1L)).thenReturn(5L);

        StreakResponseDto response = attendanceService.getStreak("user1");

        assertThat(response.currentStreak()).isEqualTo(2);
        assertThat(response.maxStreak()).isEqualTo(3);
        assertThat(response.totalCheckIns()).isEqualTo(5L);
    }

    // builds a minimal AttendanceEntity stub with the given date
    private AttendanceEntity attendanceEntityWithDate(LocalDate date) {
        AttendanceEntity entity = mock(AttendanceEntity.class);
        when(entity.getCheckInDate()).thenReturn(date);
        return entity;
    }
}
