package com.chh.watchover.global.common;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
@JsonPropertyOrder({"code","message","data"})
public class ApiResponse <T>{

    private String code;
    private String message;
    private T data;

    public static <T> ApiResponse<T> success(T data) {
        return ApiResponse.<T>builder()
                .code("")
                .message("요청 성공")
                .data(data)
                .build();
    }

}
