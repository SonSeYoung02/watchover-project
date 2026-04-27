package com.chh.watchover.global.exception;

import com.chh.watchover.global.exception.code.ErrorCode;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public class OpenAiApiException extends RuntimeException {

    private final ErrorCode errorCode;

    public OpenAiApiException(ErrorCode errorCode) {
        super(errorCode.getMessage());
        this.errorCode = errorCode;
    }

    public HttpStatus getHttpStatus() {
        return errorCode.getHttpStatus();
    }
}
