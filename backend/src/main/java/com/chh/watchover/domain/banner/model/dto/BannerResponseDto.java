package com.chh.watchover.domain.banner.model.dto;

import com.chh.watchover.domain.banner.model.entity.BannerEntity;

public record BannerResponseDto(
        Long bannerId,
        String content
) {
    public static BannerResponseDto from(BannerEntity bannerEntity) {
        return new BannerResponseDto(
                bannerEntity.getBannerId(),
                bannerEntity.getContent()
        );
    }
}