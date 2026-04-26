package com.chh.watchover.domain.attendance.model.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;

@Schema(description = "출석 체크 요청")
public record CheckInRequestDto(
        @Schema(description = "클라이언트 타임존", example = "Asia/Seoul")
        @NotBlank String timezone
) {
}
