package com.chh.watchover.domain.banner.service;

import com.chh.watchover.domain.banner.model.dto.BannerResponseDto;
import com.chh.watchover.domain.banner.model.entity.BannerEntity;
import com.chh.watchover.domain.banner.repository.BannerRepository;
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
class BannerServiceTest {

    @Mock
    private BannerRepository bannerRepository;

    @InjectMocks
    private BannerService bannerService;

    // --- getActiveBanners ---

    @Test
    void getActiveBanners_returnsEmptyList_whenNoActiveBannersExist() {
        when(bannerRepository.findAllByIsActivate(1)).thenReturn(List.of());

        List<BannerResponseDto> result = bannerService.getActiveBanners();

        assertThat(result).isEmpty();
    }

    @Test
    void getActiveBanners_returnsMappedDtos_forEachActiveBanner() {
        // given
        BannerEntity banner1 = bannerEntity(1L, "공지 내용 1");
        BannerEntity banner2 = bannerEntity(2L, "공지 내용 2");
        when(bannerRepository.findAllByIsActivate(1)).thenReturn(List.of(banner1, banner2));

        // when
        List<BannerResponseDto> result = bannerService.getActiveBanners();

        // then
        assertThat(result).hasSize(2);
        assertThat(result.get(0).bannerId()).isEqualTo(1L);
        assertThat(result.get(0).content()).isEqualTo("공지 내용 1");
        assertThat(result.get(1).bannerId()).isEqualTo(2L);
        assertThat(result.get(1).content()).isEqualTo("공지 내용 2");
    }

    @Test
    void getActiveBanners_queriesRepositoryWithActivateFlag1() {
        // given
        when(bannerRepository.findAllByIsActivate(1)).thenReturn(List.of());

        // when
        bannerService.getActiveBanners();

        // then
        verify(bannerRepository).findAllByIsActivate(1);
        verifyNoMoreInteractions(bannerRepository);
    }

    // --- getActiveBannerById ---

    @Test
    void getActiveBannerById_throwsIllegalArgumentException_whenBannerNotFound() {
        when(bannerRepository.findByBannerIdAndIsActivate(99L, 1)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> bannerService.getActiveBannerById(99L))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("해당 배너를 찾을 수 없거나 비활성화 상태입니다");
    }

    @Test
    void getActiveBannerById_returnsMappedDto_whenActiveBannerExists() {
        BannerEntity banner = bannerEntity(5L, "이벤트 배너");
        when(bannerRepository.findByBannerIdAndIsActivate(5L, 1)).thenReturn(Optional.of(banner));

        BannerResponseDto result = bannerService.getActiveBannerById(5L);

        assertThat(result.bannerId()).isEqualTo(5L);
        assertThat(result.content()).isEqualTo("이벤트 배너");
    }

    private BannerEntity bannerEntity(Long id, String content) {
        BannerEntity entity = mock(BannerEntity.class);
        when(entity.getBannerId()).thenReturn(id);
        when(entity.getContent()).thenReturn(content);
        return entity;
    }
}
