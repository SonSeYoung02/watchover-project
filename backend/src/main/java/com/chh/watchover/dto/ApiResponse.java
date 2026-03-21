package com.chh.watchover.dto;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.Builder;
import lombok.Getter;
import org.aspectj.apache.bcel.classfile.Code;

@Builder
@Getter
@JsonPropertyOrder({"code","message","data","error"})
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
