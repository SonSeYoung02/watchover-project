package com.chh.watchover.domain.banner.controller;

import com.chh.watchover.global.common.ApiResponse;
import com.chh.watchover.domain.banner.model.dto.BannerResponseDto;
import com.chh.watchover.domain.banner.service.BannerService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@Tag(name = "Banner", description = "배너 조회 API")
@RestController
@RequestMapping("/api/banners")
@RequiredArgsConstructor
public class BannerController {

    private final BannerService bannerService;

    /**
     * 현재 활성화된 배너 목록 전체를 조회한다.
     *
     * @return 활성 배너 리스트를 담은 ResponseEntity
     */
    // 기존: GET /api/banners
    @Operation(summary = "활성 배너 전체 조회")
    @GetMapping
    public ResponseEntity<ApiResponse<List<BannerResponseDto>>> getBanners() {
        List<BannerResponseDto> activeBanners = bannerService.getActiveBanners();
        return ResponseEntity.ok(ApiResponse.success(activeBanners));
    }

    /**
     * 특정 ID에 해당하는 활성 배너 단건을 조회한다.
     *
     * @param id 조회할 배너의 고유 식별자
     * @return 조회된 배너 정보를 담은 ResponseEntity
     */
    // 추가: GET /api/banners/{id}
    @Operation(summary = "배너 단건 조회")
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<BannerResponseDto>> getBannerById(@PathVariable("id") Long id) {
        BannerResponseDto banner = bannerService.getActiveBannerById(id);
        // 데이터가 리스트가 아닌 단일 객체로 응답됨
        return ResponseEntity.ok(ApiResponse.success(banner));
    }
}