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

    /**
     * 요청 성공 시 데이터를 포함한 ApiResponse를 생성합니다.
     *
     * @param <T>  응답 데이터 타입
     * @param data 응답에 포함할 데이터
     * @return 성공 코드와 데이터를 담은 ApiResponse
     */
    public static <T> ApiResponse<T> success(T data) {
        return ApiResponse.<T>builder()
                .code("SUCCESS")
                .message("요청 성공")
                .data(data)
                .build();
    }

    /**
     * 비즈니스 오류 발생 시 에러 코드를 포함한 ApiResponse를 생성합니다.
     *
     * @param <T>       응답 데이터 타입
     * @param errorCode 발생한 에러 코드
     * @return 에러 코드, 메시지, 오류 이름을 담은 ApiResponse
     */
    public static <T> ApiResponse<T> fail(ErrorCode errorCode) {
        return ApiResponse.<T>builder()
                .code(errorCode.getCode())
                .message(errorCode.getMessage())
                .data(null)
                .build();
    }

    /**
     * 서버 내부 오류 발생 시 사용자 정의 메시지를 포함한 ApiResponse를 생성합니다.
     *
     * @param <T>     응답 데이터 타입
     * @param message 클라이언트에 전달할 오류 메시지
     * @return 내부 서버 오류 코드와 메시지를 담은 ApiResponse
     */
    public static <T> ApiResponse<T> error(String message) {
        return ApiResponse.<T>builder()
                .code(ErrorCode.INTERNAL_SERVER_ERROR.getCode())
                .message(message)
                .data(null)
                .build();
    }
}
