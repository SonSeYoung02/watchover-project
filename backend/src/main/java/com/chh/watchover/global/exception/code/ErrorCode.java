package com.chh.watchover.global.exception.code;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum ErrorCode {

    // ==================== User ====================
    USER_NOT_FOUND("U001", "해당 유저 정보를 찾을 수 없습니다.", HttpStatus.NOT_FOUND),
    DUPLICATE_ID("U002", "이미 존재하는 아이디 입니다.", HttpStatus.CONFLICT),
    DUPLICATE_EMAIL("U003", "이미 존재하는 이메일 입니다.", HttpStatus.CONFLICT),
    LOGIN_FAILED("U004", "로그인 실패", HttpStatus.UNAUTHORIZED),

    // ==================== Community ====================
    POST_NOT_FOUND("C001", "해당 게시물을 찾을 수 없습니다.", HttpStatus.NOT_FOUND),
    FORBIDDEN_ACCESS("C002", "글 작성자가 아닙니다.", HttpStatus.FORBIDDEN),
    BOOKMARK_NOT_FOUND("C003", "해당 북마크를 찾을 수 없습니다.", HttpStatus.NOT_FOUND),
    COMMENT_NOT_FOUND("C004", "해당 댓글을 찾을 수 없습니다.", HttpStatus.NOT_FOUND),
    UNAUTHORIZED_USER("C005", "본인이 작성한 글이 아닙니다.", HttpStatus.FORBIDDEN),
    COMMENT_NOT_IN_POST("C006", "해당 게시물 안에 찾는 댓글이 없습니다.", HttpStatus.NOT_FOUND),

    // ==================== Attendance ====================
    ALREADY_CHECKED_IN("A001", "오늘 이미 출석 체크를 하셨습니다.", HttpStatus.CONFLICT),

    // ==================== Chatbot ====================
    OPENAI_API_ERROR("CB001", "OpenAI API 호출 중 오류가 발생했습니다.", HttpStatus.BAD_GATEWAY),

    // ==================== Global ====================
    INVALID_INPUT("G001", "입력값이 올바르지 않습니다.", HttpStatus.BAD_REQUEST),
    INTERNAL_SERVER_ERROR("G002", "서버 내부 에러가 발생했습니다.", HttpStatus.INTERNAL_SERVER_ERROR);

    private final String code;
    private final String message;
    private final HttpStatus httpStatus;

    ErrorCode(String code, String message, HttpStatus httpStatus) {
        this.code = code;
        this.message = message;
        this.httpStatus = httpStatus;
    }
}