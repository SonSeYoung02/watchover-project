package com.chh.watchover.domain.character.controller;

import com.chh.watchover.domain.character.model.dto.CharacterResponse;
import com.chh.watchover.domain.character.service.CharacterService;
import com.chh.watchover.global.common.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/characters")
@RequiredArgsConstructor
public class CharacterController {

    private final CharacterService characterService;

    @PostMapping(value = "/generate", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<CharacterResponse>> generateCharacter(
            @RequestParam("image") MultipartFile image,
            @RequestParam("userId") Long userId // [수정] DB 저장을 위해 userId 파라미터 추가
    ) {
        try {
            // [수정] 서비스 호출 시 userId 전달
            String s3ImageUrl = characterService.createMultimodalCharacter(image, userId);

            // 전용 Response DTO에 S3 URL 담아서 반환
            CharacterResponse data = new CharacterResponse(s3ImageUrl);

            return ResponseEntity.ok(ApiResponse.success(data));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("캐릭터 생성 중 오류가 발생했습니다: " + e.getMessage()));
        }
    }
}