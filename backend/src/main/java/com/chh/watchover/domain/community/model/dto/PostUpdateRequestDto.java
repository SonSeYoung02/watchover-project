package com.chh.watchover.domain.community.model.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Builder
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class PostUpdateRequestDto {

    @NotBlank(message = "제목은 공백으로 제출할 수 없습니다.")
    private String title;

    @NotBlank(message = "본문은 공백으로 제출할 수 없습니다.")
    private String content;

}
