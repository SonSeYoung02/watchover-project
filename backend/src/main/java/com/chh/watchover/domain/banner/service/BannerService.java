package com.chh.watchover.domain.banner.service;

import com.chh.watchover.domain.banner.model.dto.BannerResponseDto;
import com.chh.watchover.domain.banner.model.entity.BannerEntity;
import com.chh.watchover.domain.banner.repository.BannerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BannerService {

    private final BannerRepository bannerRepository;

    // 기존: 전체 조회
    public List<BannerResponseDto> getActiveBanners() {
        return bannerRepository.findAllByIsActivate(1).stream()
                .map(BannerResponseDto::from)
                .toList();
    }

    // 추가: 단건 조회
    public BannerResponseDto getActiveBannerById(Long id) {
        BannerEntity bannerEntity = bannerRepository.findByBannerIdAndIsActivate(id, 1)
                .orElseThrow(() -> new IllegalArgumentException("해당 배너를 찾을 수 없거나 비활성화 상태입니다."));

        return BannerResponseDto.from(bannerEntity);
    }
}
