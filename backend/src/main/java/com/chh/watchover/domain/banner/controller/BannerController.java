package com.chh.watchover.domain.banner.controller;

import com.chh.watchover.global.common.ApiResponse;
import com.chh.watchover.domain.banner.model.dto.BannerResponseDto;
import com.chh.watchover.domain.banner.service.BannerService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
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

    @Operation(summary = "활성 배너 전체 조회", description = "현재 활성화된 배너 목록 전체를 조회합니다.")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "조회 성공")
    })
    @GetMapping
    public ResponseEntity<ApiResponse<List<BannerResponseDto>>> getBanners() {
        List<BannerResponseDto> activeBanners = bannerService.getActiveBanners();
        return ResponseEntity.ok(ApiResponse.success(activeBanners));
    }

    @Operation(summary = "배너 단건 조회", description = "특정 ID에 해당하는 활성 배너 단건을 조회합니다.")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "조회 성공"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "배너 없음")
    })
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<BannerResponseDto>> getBannerById(
            @Parameter(description = "조회할 배너 ID", required = true) @PathVariable("id") Long id) {
        BannerResponseDto banner = bannerService.getActiveBannerById(id);
        return ResponseEntity.ok(ApiResponse.success(banner));
    }
}