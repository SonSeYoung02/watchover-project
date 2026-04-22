package com.chh.watchover.domain.chatbot.controller;

import com.chh.watchover.domain.chatbot.model.dto.ChatRequest;
import com.chh.watchover.domain.chatbot.model.dto.ChatResponse;
import com.chh.watchover.domain.chatbot.service.ChatService;
import com.chh.watchover.global.common.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "ChatBot", description = "AI 챗봇 API")
@RestController
@RequestMapping("/api/chatBot")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    /**
     * AI 챗봇에게 메시지를 전송하고 답변을 받는다.
     *
     * @param loginId    JWT에서 추출된 현재 사용자의 로그인 아이디
     * @param chatRoomId 메시지를 전송할 채팅방의 고유 식별자
     * @param request    전송할 메시지 및 프롬프트 파일 정보를 담은 요청 DTO
     * @return AI의 답변을 담은 ApiResponse
     */
    @Operation(summary = "AI에게 메시지 전송")
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
     * 특정 채팅방의 전체 대화 내역을 조회한다.
     *
     * @param loginId    JWT에서 추출된 현재 사용자의 로그인 아이디 (본인 채팅 내역 검증용)
     * @param chatRoomId 조회할 채팅방의 고유 식별자
     * @return 해당 채팅방의 전체 대화 내역 리스트를 담은 ApiResponse
     */
    @Operation(summary = "채팅방 대화 내역 조회")
    @GetMapping("/{chatingRoomId}")
    public ApiResponse<List<ChatResponse>> getHistory(
            @AuthenticationPrincipal String loginId, // 본인의 채팅 내역인지 검증용
            @PathVariable("chatingRoomId") Long chatRoomId) {

        // 해당 채팅방의 내역을 리스트로 반환합니다.
        List<ChatResponse> history = chatService.getChatHistory(chatRoomId);
        return ApiResponse.success(history);
    }
}