package com.chh.watchover.global.exception.common;

import com.chh.watchover.global.common.ApiResponse;
import com.chh.watchover.global.exception.CustomException;
import com.chh.watchover.global.exception.code.ErrorCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

    /*
    1. 내가 만든 에러 반환
     */
    @ExceptionHandler(CustomException.class)
    public ResponseEntity<ApiResponse<?>> handleCustomException(CustomException e) {
        return ResponseEntity
                .status(e.getHttpStatus())
                .body(ApiResponse.fail(e.getErrorCode()));
    }

    /*
    2. dto @valid 에러 반환 핸들러
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<?>> handleValidationException(MethodArgumentNotValidException e) {
        Map<String, String> errors = e.getBindingResult().getFieldErrors().stream()
                .collect(Collectors.toMap(
                        fieldError -> fieldError.getField(),
                        fieldError -> fieldError.getDefaultMessage(),
                        (existing, replacement) -> existing
                ));
        return ResponseEntity
                .status(ErrorCode.INVALID_INPUT.getHttpStatus())
                .body(ApiResponse.<Map<String, String>>builder()
                        .code(ErrorCode.INVALID_INPUT.getCode())
                        .message(ErrorCode.INVALID_INPUT.getMessage())
                        .data(errors)
                        .build());
    }

    /*
    3. 서버에서 난 에러 반환
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<?>> handleException(Exception e) {
        return ResponseEntity
                .status(ErrorCode.INTERNAL_SERVER_ERROR.getHttpStatus())
                .body(ApiResponse.fail(ErrorCode.INTERNAL_SERVER_ERROR));
    }
}