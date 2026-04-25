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

    /**
     * 전역 범위에서 발생한 커스텀 예외를 처리합니다.
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
     * 요청 바디의 유효성 검사 실패 시 발생하는 예외를 처리합니다.
     *
     * @param e 발생한 MethodArgumentNotValidException
     * @return 필드별 유효성 오류 메시지를 담은 ApiResponse
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

    /**
     * 처리되지 않은 일반 예외를 캐치하여 내부 서버 오류 응답을 반환합니다.
     *
     * @param e 발생한 Exception
     * @return 내부 서버 오류 코드를 담은 ApiResponse
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<?>> handleException(Exception e) {
        return ResponseEntity
                .status(ErrorCode.INTERNAL_SERVER_ERROR.getHttpStatus())
                .body(ApiResponse.fail(ErrorCode.INTERNAL_SERVER_ERROR));
    }
}