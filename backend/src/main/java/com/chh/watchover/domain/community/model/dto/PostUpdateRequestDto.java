package com.chh.watchover.domain.community.model.dto;

import jakarta.validation.constraints.NotBlank;

public record PostUpdateRequestDto(
        @NotBlank(message = "제목은 공백으로 제출할 수 없습니다.") String title,
        @NotBlank(message = "본문은 공백으로 제출할 수 없습니다.") String content
) {}