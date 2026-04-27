package com.chh.watchover.domain.chatbot.model.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Schema(description = "AI 챗봇 응답")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ChatResponse {
    @Schema(description = "채팅방 ID")
    private Long chatRoomId;
    @Schema(description = "AI 답변 내용")
    private String answer;
}