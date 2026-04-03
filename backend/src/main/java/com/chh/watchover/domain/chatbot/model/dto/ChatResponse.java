package com.chh.watchover.domain.chatbot.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder // 빌더 패턴을 쓰면 객체 생성이 더 편해집니다!
public class ChatResponse {
    private Long chatRoomId; // 어느 방에 저장되었는지 알려줍니다.
    private String answer;   // GPT의 답변 내용
}