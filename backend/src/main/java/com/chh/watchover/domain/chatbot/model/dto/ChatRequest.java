package com.chh.watchover.domain.chatbot.model.dto;

import lombok.Data;

@Data
public class ChatRequest {
    private String promptFile; // 사용할 페르소나 파일명 (예: doctor.txt)
    private String message;    // 사용자가 입력한 메시지
}
