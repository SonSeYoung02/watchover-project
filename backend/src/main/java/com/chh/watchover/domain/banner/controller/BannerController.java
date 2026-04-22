package com.chh.watchover.domain.banner.controller;

import com.chh.watchover.global.common.ApiResponse;
import com.chh.watchover.domain.banner.model.dto.BannerResponseDto;
import com.chh.watchover.domain.banner.service.BannerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable; // 추가
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping("/api/banners")
@RequiredArgsConstructor
public class BannerController {

    private final BannerService bannerService;

    // 기존: GET /api/banners
    @GetMapping
    public ResponseEntity<ApiResponse<List<BannerResponseDto>>> getBanners() {
        List<BannerResponseDto> activeBanners = bannerService.getActiveBanners();
        return ResponseEntity.ok(ApiResponse.success(activeBanners));
    }

    // 추가: GET /api/banners/{id}
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<BannerResponseDto>> getBannerById(@PathVariable("id") Long id) {
        BannerResponseDto banner = bannerService.getActiveBannerById(id);
        // 데이터가 리스트가 아닌 단일 객체로 응답됨
        return ResponseEntity.ok(ApiResponse.success(banner));
    }
}