package com.chh.watchover.domain.banner.model.dto;

import com.chh.watchover.domain.banner.model.entity.BannerEntity;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "배너 응답")
public record BannerResponseDto(
        @Schema(description = "배너 ID") Long bannerId,
        @Schema(description = "배너 내용") String content
) {
    public static BannerResponseDto from(BannerEntity bannerEntity) {
        return new BannerResponseDto(
                bannerEntity.getBannerId(),
                bannerEntity.getContent()
        );
    }
}