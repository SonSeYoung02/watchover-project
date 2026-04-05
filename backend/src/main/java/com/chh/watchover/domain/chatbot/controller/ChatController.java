package com.chh.watchover.domain.chatbot.controller;

import com.chh.watchover.domain.chatbot.model.dto.ChatRequest;
import com.chh.watchover.global.common.ApiResponse;
import com.chh.watchover.domain.chatbot.model.dto.ChatResponse;
import com.chh.watchover.domain.chatbot.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chatBot")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    // 1. GPT에게 질문하고 답변 받기 (기존 기능)
    @PostMapping("/{chatingRoomId}")
    public ApiResponse<ChatResponse> ask(
            @RequestParam Long userId,
            @PathVariable("chatingRoomId") Long chatRoomId,
            @RequestBody ChatRequest request) {

        ChatResponse chatResponse = chatService.getChatResponse(
                userId,
                chatRoomId,
                request.getPromptFile(),
                request.getMessage()
        );

        return ApiResponse.success(chatResponse);
    }

    // 2. 특정 채팅방의 모든 대화 내역 가져오기 (새로 추가될 기능) ✅
    @GetMapping("/{chatingRoomId}")
    public ApiResponse<List<ChatResponse>> getHistory(
            @PathVariable("chatingRoomId") Long chatRoomId) {

        List<ChatResponse> history = chatService.getChatHistory(chatRoomId);
        return ApiResponse.success(history);
    }
}