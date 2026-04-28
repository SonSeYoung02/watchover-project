package com.chh.watchover.global.exception.character;

import com.chh.watchover.global.common.ApiResponse;
import com.chh.watchover.global.exception.CustomException;
import com.chh.watchover.global.exception.OpenAiApiException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.multipart.MultipartException;

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

    @ExceptionHandler({MaxUploadSizeExceededException.class, MultipartException.class})
    public ResponseEntity<ApiResponse<?>> handleMultipartException(Exception e) {
        return ResponseEntity
                .status(HttpStatus.CONTENT_TOO_LARGE)
                .body(ApiResponse.<Object>builder()
                        .code("CH002")
                        .message("업로드할 수 있는 이미지 크기는 최대 10MB입니다.")
                        .data(null)
                        .build());
    }
}
