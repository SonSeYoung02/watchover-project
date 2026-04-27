package com.chh.watchover.domain.assessment.service;

import com.chh.watchover.domain.assessment.model.dto.AssessmentResponseDto;
import com.chh.watchover.domain.assessment.model.entity.AssessmentEntity;
import com.chh.watchover.domain.assessment.repository.AssessmentRepository;
import com.chh.watchover.domain.user.model.entity.UserEntity;
import com.chh.watchover.domain.user.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AssessmentServiceTest {

    @Mock
    private AssessmentRepository assessmentRepository;
    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private AssessmentService assessmentService;

    @Test
    void getUserAssessmentsByLoginId_throwsIllegalArgumentException_whenUserNotFound() {
        when(userRepository.findByLoginId("unknown")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> assessmentService.getUserAssessmentsByLoginId("unknown"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("해당 유저를 찾을 수 없습니다");
    }

    @Test
    void getUserAssessmentsByLoginId_returnsEmptyList_whenUserHasNoAssessments() {
        UserEntity user = mock(UserEntity.class);
        when(user.getUserId()).thenReturn(1L);
        when(userRepository.findByLoginId("user1")).thenReturn(Optional.of(user));
        when(assessmentRepository.findByUserUserId(1L)).thenReturn(List.of());

        List<AssessmentResponseDto> result = assessmentService.getUserAssessmentsByLoginId("user1");

        assertThat(result).isEmpty();
    }

    @Test
    void getUserAssessmentsByLoginId_returnsMappedDtos_whenAssessmentsExist() {
        UserEntity user = mock(UserEntity.class);
        when(user.getUserId()).thenReturn(42L);
        when(userRepository.findByLoginId("user1")).thenReturn(Optional.of(user));

        AssessmentEntity entity1 = mock(AssessmentEntity.class);
        when(entity1.getAssessmentId()).thenReturn(10L);
        when(entity1.getResult()).thenReturn("경미한 우울");

        AssessmentEntity entity2 = mock(AssessmentEntity.class);
        when(entity2.getAssessmentId()).thenReturn(11L);
        when(entity2.getResult()).thenReturn("정상");

        when(assessmentRepository.findByUserUserId(42L)).thenReturn(List.of(entity1, entity2));

        List<AssessmentResponseDto> result = assessmentService.getUserAssessmentsByLoginId("user1");

        assertThat(result).hasSize(2);
        assertThat(result.get(0).getId()).isEqualTo(10L);
        assertThat(result.get(0).getResult()).isEqualTo("경미한 우울");
        assertThat(result.get(1).getId()).isEqualTo(11L);
        assertThat(result.get(1).getResult()).isEqualTo("정상");
    }

    @Test
    void getUserAssessmentsByLoginId_delegatesQueryToRepositoryWithCorrectUserId() {
        UserEntity user = mock(UserEntity.class);
        when(user.getUserId()).thenReturn(7L);
        when(userRepository.findByLoginId("user7")).thenReturn(Optional.of(user));
        when(assessmentRepository.findByUserUserId(7L)).thenReturn(List.of());

        assessmentService.getUserAssessmentsByLoginId("user7");

        verify(assessmentRepository).findByUserUserId(7L);
        verifyNoMoreInteractions(assessmentRepository);
    }
}
