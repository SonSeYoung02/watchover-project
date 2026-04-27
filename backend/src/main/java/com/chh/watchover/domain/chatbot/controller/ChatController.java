package com.chh.watchover.domain.chatbot.controller;

import com.chh.watchover.domain.chatbot.model.dto.ChatRequest;
import com.chh.watchover.domain.chatbot.model.dto.ChatResponse;
import com.chh.watchover.domain.chatbot.model.dto.ChatRoomListResponse;
import com.chh.watchover.domain.chatbot.service.ChatService;
import com.chh.watchover.global.common.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
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

    @Operation(summary = "AI에게 메시지 전송", description = "AI 챗봇에게 메시지를 전송하고 답변을 받습니다.")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "AI 답변 반환 성공"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "인증 실패"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "채팅방 없음")
    })
    @PostMapping("/{chatingRoomId}")
    public ApiResponse<ChatResponse> ask(
            @AuthenticationPrincipal String loginId,
            @Parameter(description = "메시지를 전송할 채팅방 ID", required = true) @PathVariable("chatingRoomId") Long chatRoomId,
            @RequestBody ChatRequest request) {
        ChatResponse chatResponse = chatService.getChatResponse(
                loginId,
                chatRoomId,
                request.getPromptFile(),
                request.getMessage()
        );
        return ApiResponse.success(chatResponse);
    }

    @Operation(summary = "내 채팅방 목록 조회", description = "로그인된 유저의 채팅방 목록을 최신순으로 반환합니다.")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "목록 조회 성공"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "인증 실패")
    })
    @GetMapping("/list")
    public ApiResponse<List<ChatRoomListResponse>> getChatRoomList(
            @AuthenticationPrincipal String loginId) {
        return ApiResponse.success(chatService.getChatRoomList(loginId));
    }

    @Operation(summary = "채팅방 대화 내역 조회", description = "특정 채팅방의 전체 대화 내역을 조회합니다.")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "대화 내역 조회 성공"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "인증 실패"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "채팅방 없음")
    })
    @GetMapping("/{chatingRoomId}")
    public ApiResponse<List<ChatResponse>> getHistory(
            @AuthenticationPrincipal String loginId,
            @Parameter(description = "조회할 채팅방 ID", required = true) @PathVariable("chatingRoomId") Long chatRoomId) {
        List<ChatResponse> history = chatService.getChatHistory(chatRoomId);
        return ApiResponse.success(history);
    }
}