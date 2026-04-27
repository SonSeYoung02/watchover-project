package com.chh.watchover.domain.banner.service;

import com.chh.watchover.domain.banner.model.dto.BannerResponseDto;
import com.chh.watchover.domain.banner.model.entity.BannerEntity;
import com.chh.watchover.domain.banner.repository.BannerRepository;
import com.chh.watchover.global.exception.CustomException;
import com.chh.watchover.global.exception.code.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BannerService {

    private final BannerRepository bannerRepository;

    /**
     * 활성화된 모든 배너 목록을 조회합니다.
     *
     * @return 활성화 상태인 배너 정보 DTO 목록
     */
    public List<BannerResponseDto> getActiveBanners() {
        return bannerRepository.findAllByIsActivate(1).stream()
                .map(BannerResponseDto::from)
                .toList();
    }

    /**
     * ID에 해당하는 활성화된 배너 단건을 조회합니다.
     *
     * @param id 조회할 배너의 고유 ID
     * @return 활성화 상태인 배너 정보 DTO
     * @throws IllegalArgumentException 해당 ID의 배너가 존재하지 않거나 비활성화 상태인 경우
     */
    public BannerResponseDto getActiveBannerById(Long id) {
        BannerEntity bannerEntity = bannerRepository.findByBannerIdAndIsActivate(id, 1)
                .orElseThrow(() -> new CustomException(ErrorCode.BANNER_NOT_FOUND));

        return BannerResponseDto.from(bannerEntity);
    }
}
