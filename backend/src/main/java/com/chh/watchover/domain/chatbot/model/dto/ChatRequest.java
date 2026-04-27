package com.chh.watchover.domain.chatbot.model.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Schema(description = "AI 챗봇 메시지 전송 요청")
@Data
public class ChatRequest {

    @Schema(description = "사용할 페르소나 파일명", example = "care-prompt")
    private String promptFile;

    @Schema(description = "사용자가 입력한 메시지", example = "오늘 기분이 좋지 않아")
    private String message;
}
