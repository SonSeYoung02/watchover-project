package com.chh.watchover.global.exception.model;

import lombok.Getter;

@Getter
public enum ErrorCode {

    // [유저 조회: 비즈니스 에러] 찾는 회원이 없는 경우
    USER_NOT_FOUND("", "해당 유저 정보를 찾을 수 없습니다."),

    // [회원가입: 비즈니스 에러] 아이디 오류
    DUPLICATE_ID("","이미 존재하는 아이디 입니다."),

    // [@Valid 에러] Valid에서 나오는 에러 처리
    INVALID_INPUT("", "입력값이 올바르지 않습니다."),

    // [회원가입] 이메일 오류
    DUPLICATE_EMAIL("", "이미 존재하는 이메일 입니다."),

    // [로그인] 로그인 실패 오류
    LOGIN_FAILED("", "로그인 실패"),

    // [게시물] 게시물을 찾을 수 없습니다.
    POST_NOT_FOUND("", "해당 게시물을 찾을 수 없습니다."),

    // [게시물] 해당 글 작성자가 아닌경우 에러
    FORBIDDEN_ACCESS("", "글 작성자가 아닙니다."),

    // [북마크] 해당 북마크가 없는 경우 에러
    BOOKMARK_NOT_FOUND("", "해당 북마크를 찾을 수 없습니다."),

    // [댓글] 해당 댓글이 없는 경우 에러
    COMMENT_NOT_FOUND("", "해당 댓글을 찾을 수 없습니다."),

    UNAUTHORIZED_USER("", "본인이 작성한글이 아닙니다."),

    COMMENT_NOT_IN_POST("", "해당 게시물안에 찾는 댓글이 없습니다."),

    // [서버] 서버 에러
    INTERNAL_SERVER_ERROR("", "서버 내부 에러가 발생했습니다.");

    private final String code;
    private final String message;

    // 생성자
    ErrorCode(String code, String message) {
        this.code = code;
        this.message = message;
    }
}
