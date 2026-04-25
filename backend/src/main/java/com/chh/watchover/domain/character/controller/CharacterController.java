package com.chh.watchover.domain.character.controller;

import com.chh.watchover.domain.character.model.dto.CharacterResponse;
import com.chh.watchover.domain.character.service.CharacterService;
import com.chh.watchover.global.common.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@Tag(name = "Character", description = "캐릭터 생성 API")
@RestController
@RequestMapping("/api/characters")
@RequiredArgsConstructor
public class CharacterController {

    private final CharacterService characterService;

    @Operation(summary = "캐릭터 생성", description = "업로드된 이미지를 기반으로 AI 캐릭터를 생성하고 S3에 저장합니다.")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "캐릭터 생성 성공"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "이미지 없음 또는 잘못된 요청"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "캐릭터 생성 중 서버 오류")
    })
    @PostMapping(value = "/generate", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<CharacterResponse>> generateCharacter(
            @Parameter(description = "캐릭터 생성에 사용할 원본 이미지 파일", required = true) @RequestParam("image") MultipartFile image,
            @Parameter(description = "캐릭터를 소유할 사용자 ID", required = true) @RequestParam("userId") Long userId
    ) {
        try {
            String s3ImageUrl = characterService.createMultimodalCharacter(image, userId);
            CharacterResponse data = new CharacterResponse(s3ImageUrl);
            return ResponseEntity.ok(ApiResponse.success(data));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("캐릭터 생성 중 오류가 발생했습니다: " + e.getMessage()));
        }
    }
}