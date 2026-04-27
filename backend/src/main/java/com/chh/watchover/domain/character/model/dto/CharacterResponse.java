package com.chh.watchover.domain.character.model.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Schema(description = "캐릭터 생성 응답")
@Getter
@AllArgsConstructor
public class CharacterResponse {
    @Schema(description = "생성된 캐릭터 이미지 S3 URL")
    private String characterUrl;
}
