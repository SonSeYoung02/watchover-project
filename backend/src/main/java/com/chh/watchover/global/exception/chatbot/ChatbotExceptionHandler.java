package com.chh.watchover.global.exception.chatbot;

import com.chh.watchover.global.common.ApiResponse;
import com.chh.watchover.global.exception.CustomException;
import com.chh.watchover.global.exception.OpenAiApiException;
import com.chh.watchover.global.exception.code.ErrorCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice(basePackages = "com.chh.watchover.domain.chatbot")
public class ChatbotExceptionHandler {

    /**
     * Chatbot 도메인에서 발생한 커스텀 예외를 처리합니다.
     *
     * @param e 발생한 CustomException
     * @return 에러 코드와 HTTP 상태를 담은 ApiResponse
     */
    @ExceptionHandler(CustomException.class)
    public ResponseEntity<ApiResponse<?>> handleCustomException(CustomException e) {
        return ResponseEntity
                .status(e.getHttpStatus())
                .body(ApiResponse.fail(e.getErrorCode()));
    }

    /**
     * OpenAI API 호출 중 발생한 예외를 처리합니다.
     *
     * @param e 발생한 OpenAiApiException
     * @return OpenAI API 에러 코드와 메시지를 담은 ApiResponse
     */
    @ExceptionHandler(OpenAiApiException.class)
    public ResponseEntity<ApiResponse<?>> handleOpenAiException(OpenAiApiException e) {
        return ResponseEntity
                .status(ErrorCode.OPENAI_API_ERROR.getHttpStatus())
                .body(ApiResponse.<Void>builder()
                        .code(ErrorCode.OPENAI_API_ERROR.getCode())
                        .message(e.getMessage())
                        .data(null)
                        .error(ErrorCode.OPENAI_API_ERROR.name())
                        .build());
    }
}