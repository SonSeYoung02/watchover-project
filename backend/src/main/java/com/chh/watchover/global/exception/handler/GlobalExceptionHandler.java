package com.chh.watchover.global.exception.handler;

import com.chh.watchover.global.common.ApiResponse;
import com.chh.watchover.global.exception.CustomException;
import com.chh.watchover.global.exception.model.ErrorCode;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;
import java.util.stream.Collectors;


@RestControllerAdvice
public class GlobalExceptionHandler {

    // 1. 커스텀 에러 처리
    @ExceptionHandler(CustomException.class)
    public ApiResponse<?> handleCustomException(CustomException e) {
        return ApiResponse.builder()
                .code(e.getErrorCode().getCode())
                .message(e.getMessage())
                .data(null)
                .build();
    }

    // 2. @Valid 검증 실패 에러 처리
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ApiResponse<?> handleValidationException(MethodArgumentNotValidException e) {

        Map<String, String> error = e.getBindingResult().getFieldErrors().stream()
                .collect(Collectors.toMap(
                        fieldError -> fieldError.getField(),
                        fieldError -> fieldError.getDefaultMessage(),
                        (existing, replacement) -> existing
                ));

        return ApiResponse.builder()
                .code(ErrorCode.INVALID_INPUT.getCode())
                .message(ErrorCode.INVALID_INPUT.getMessage())
                .data(error)
                .build();
    }
}
