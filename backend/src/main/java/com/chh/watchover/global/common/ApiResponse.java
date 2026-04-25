package com.chh.watchover.global.common;

import com.chh.watchover.global.exception.code.ErrorCode;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
@JsonPropertyOrder({"code", "message", "data"})
public class ApiResponse<T> {

    private String code;
    private String message;
    private T data;

    /*
    1. 응답 성공
     */
    public static <T> ApiResponse<T> success(T data) {
        return ApiResponse.<T>builder()
                .code("SUCCESS")
                .message("요청 성공")
                .data(data)
                .build();
    }

    /*
    2. 내가 만든 에러
     */
    public static <T> ApiResponse<T> fail(ErrorCode errorCode) {
        return ApiResponse.<T>builder()
                .code(errorCode.getCode())
                .message(errorCode.getMessage())
                .data(null)
                .build();
    }

    /*
    3. 서버 자체에서 난 에러
     */
    public static <T> ApiResponse<T> error(String message) {
        return ApiResponse.<T>builder()
                .code(ErrorCode.INTERNAL_SERVER_ERROR.getCode())
                .message(message)
                .data(null)
                .build();
    }
}
