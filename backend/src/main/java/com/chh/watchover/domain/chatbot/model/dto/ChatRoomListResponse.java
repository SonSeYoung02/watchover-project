package com.chh.watchover.domain.chatbot.model.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Schema(description = "채팅방 목록 응답")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ChatRoomListResponse {
    @Schema(description = "채팅방 ID")
    private Long chatRoomId;
    @Schema(description = "채팅방 생성 시간")
    private LocalDateTime createdAt;
    @Schema(description = "채팅방 날짜에 기록된 감정")
    private String emotion;
}
