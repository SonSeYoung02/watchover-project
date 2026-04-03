package com.chh.watchover.domain.banner.repository;

import com.chh.watchover.domain.banner.model.entity.BannerEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional; // 추가

public interface BannerRepository extends JpaRepository<BannerEntity, Long> {
    // 기존: 활성화된 배너 목록 전체 조회
    List<BannerEntity> findAllByIsActivate(Integer isActivate);

    // 추가: 특정 ID이면서 활성화된 배너 단건 조회
    Optional<BannerEntity> findByBannerIdAndIsActivate(Long bannerId, Integer isActivate);
}
