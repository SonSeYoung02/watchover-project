package com.chh.watchover.domain.chatbot.controller;

import com.chh.watchover.domain.chatbot.model.dto.ChatRequest;
import com.chh.watchover.global.common.ApiResponse;
import com.chh.watchover.domain.chatbot.model.dto.ChatResponse;
import com.chh.watchover.domain.chatbot.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chatBot")
@RequiredArgsConstructor // 생성자 주입을 자동으로 처리해줍니다 (private final 필드 대상)
public class ChatController {

    private final ChatService chatService;

    @PostMapping("/{chatingRoomId}")
    public ApiResponse<ChatResponse> ask(
            @RequestParam Long userId,
            @PathVariable("chatingRoomId") Long chatRoomId,
            @RequestBody ChatRequest request) {
        // 이제 chatRoomId를 함께 서비스로 넘겨서 DB 히스토리를 관리합니다.
        ChatResponse chatResponse = chatService.getChatResponse(
                userId,
                chatRoomId,
                request.getPromptFile(),
                request.getMessage()
        );

        return ApiResponse.success(chatResponse);
    }
}