package com.chh.watchover.domain.assessment.service;

import com.chh.watchover.domain.assessment.model.dto.AssessmentResponseDto;
import com.chh.watchover.domain.assessment.repository.AssessmentRepository;
import com.chh.watchover.domain.user.model.entity.UserEntity; // 확인 필요
import com.chh.watchover.domain.user.repository.UserRepository;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AssessmentService {
    private final AssessmentRepository assessmentRepository;
    private final UserRepository userRepository;

    /**
     * 로그인 아이디(String)로 검사 결과 목록을 조회합니다.
     */
    @Transactional(readOnly = true)
    public List<AssessmentResponseDto> getUserAssessmentsByLoginId(String loginId) {
        // 1. UserRepository를 사용해 loginId로 UserEntity를 찾습니다.
        UserEntity user = userRepository.findByLoginId(loginId)
                .orElseThrow(() -> new IllegalArgumentException("해당 유저를 찾을 수 없습니다."));

        // 2. 찾은 유저의 고유 ID(Long)를 사용하여 결과 목록을 가져옵니다.
        // 기존 코드의 'findByUserUserId' 메서드 이름을 그대로 사용했습니다.
        return assessmentRepository.findByUserUserId(user.getUserId())
                .stream()
                .map(AssessmentResponseDto::from)
                .toList();
    }
}