package com.chh.watchover.domain.chatbot.controller;

import com.chh.watchover.domain.chatbot.model.dto.ChatRequest;
import com.chh.watchover.domain.chatbot.model.dto.ChatResponse;
import com.chh.watchover.domain.chatbot.service.ChatService;
import com.chh.watchover.global.common.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chatBot")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    /**
     * 1. AI에게 질문하고 답변 받기
     * URL: POST /api/chatBot/{chatingRoomId}
     */
    @PostMapping("/{chatingRoomId}")
    public ApiResponse<ChatResponse> ask(
            @AuthenticationPrincipal String loginId, // JWT에서 추출된 유저 식별자
            @PathVariable("chatingRoomId") Long chatRoomId,
            @RequestBody ChatRequest request) {

        // 서비스 단에서 loginId를 이용해 유저를 식별하고 답변을 가져옵니다.
        ChatResponse chatResponse = chatService.getChatResponse(
                loginId,
                chatRoomId,
                request.getPromptFile(),
                request.getMessage()
        );

        return ApiResponse.success(chatResponse);
    }

    /**
     * 2. 특정 채팅방의 모든 대화 내역 가져오기
     * URL: GET /api/chatBot/{chatingRoomId}
     */
    @GetMapping("/{chatingRoomId}")
    public ApiResponse<List<ChatResponse>> getHistory(
            @AuthenticationPrincipal String loginId, // 본인의 채팅 내역인지 검증용
            @PathVariable("chatingRoomId") Long chatRoomId) {

        // 해당 채팅방의 내역을 리스트로 반환합니다.
        List<ChatResponse> history = chatService.getChatHistory(chatRoomId);
        return ApiResponse.success(history);
    }
}