package com.chh.watchover.global.exception.character;

import com.chh.watchover.global.common.ApiResponse;
import com.chh.watchover.global.exception.CustomException;
import com.chh.watchover.global.exception.OpenAiApiException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice(basePackages = "com.chh.watchover.domain.character")
public class CharacterExceptionHandler {

    @ExceptionHandler(CustomException.class)
    public ResponseEntity<ApiResponse<?>> handleCustomException(CustomException e) {
        return ResponseEntity
                .status(e.getHttpStatus())
                .body(ApiResponse.fail(e.getErrorCode()));
    }

    @ExceptionHandler(OpenAiApiException.class)
    public ResponseEntity<ApiResponse<?>> handleOpenAiApiException(OpenAiApiException e) {
        return ResponseEntity
                .status(e.getHttpStatus())
                .body(ApiResponse.fail(e.getErrorCode()));
    }
}