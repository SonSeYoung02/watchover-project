package com.chh.watchover.domain.character.controller;

import com.chh.watchover.domain.character.model.dto.CharacterResponse;
import com.chh.watchover.domain.character.service.CharacterService;
import com.chh.watchover.global.common.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.security.Principal;

@Tag(name = "Character", description = "AI 캐릭터 생성 API")
@RestController
@RequestMapping("/api/characters")
@RequiredArgsConstructor
public class CharacterController {

    private final CharacterService characterService;

    @Operation(
            summary = "AI 캐릭터 생성",
            description = "사용자 사진을 GPT-4o로 분석한 뒤 DALL-E 3로 2D 캐릭터 이미지를 생성하고 S3에 저장합니다.",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "캐릭터 생성 성공",
                    content = @Content(schema = @Schema(implementation = CharacterResponse.class))
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "400",
                    description = "이미지가 비어있거나 프롬프트가 비어있는 경우 (CB003, CB004)"
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "404",
                    description = "프롬프트 파일 또는 사용자를 찾을 수 없는 경우 (U001, CB002)"
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "502",
                    description = "OpenAI API 호출 실패 또는 이미지 다운로드 실패 (CB001, CB005)"
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "507",
                    description = "S3 이미지 저장 실패 (CB006)"
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "500",
                    description = "DB 저장 실패 (CB007)"
            )
    })
    @PostMapping(value = "/generate", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<CharacterResponse>> generateCharacter(
            @Parameter(description = "캐릭터 생성에 사용할 원본 이미지 파일 (JPEG/PNG)", required = true)
            @RequestParam("image") MultipartFile image,
            Principal principal
    ) {
        String s3ImageUrl = characterService.createMultimodalCharacter(image, principal.getName());
        return ResponseEntity.ok(ApiResponse.success(new CharacterResponse(s3ImageUrl)));
    }
}