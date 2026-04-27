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

    @Schema(description = "메시지 작성자 역할", example = "user")
    private String role;

    @Schema(description = "메시지 내용")
    private String answer;
}
