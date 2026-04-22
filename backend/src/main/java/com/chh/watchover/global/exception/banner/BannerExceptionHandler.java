package com.chh.watchover.global.exception.banner;

import com.chh.watchover.global.common.ApiResponse;
import com.chh.watchover.global.exception.CustomException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice(basePackages = "com.chh.watchover.domain.banner")
public class BannerExceptionHandler {

    /**
     * Banner 도메인에서 발생한 커스텀 예외를 처리합니다.
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
}