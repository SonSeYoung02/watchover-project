package com.chh.watchover.domain.assessment.repository;

import com.chh.watchover.domain.assessment.model.entity.AssessmentEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AssessmentRepository extends JpaRepository<AssessmentEntity, Long> {
    // 특정 유저의 검사 결과 리스트 조회
    List<AssessmentEntity> findByUserUserId(Long userId);
}
