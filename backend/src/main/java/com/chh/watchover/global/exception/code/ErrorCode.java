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

    // ==================== Banner ====================
    BANNER_NOT_FOUND("B001", "해당 배너를 찾을 수 없거나 비활성화 상태입니다.", HttpStatus.NOT_FOUND),

    // ==================== Character ====================
    CHARACTER_NOT_FOUND("CH001", "해당 유저의 캐릭터 프로필을 찾을 수 없습니다.", HttpStatus.NOT_FOUND),
    OPENAI_API_ERROR("CB001", "OpenAI API 호출 중 오류가 발생했습니다.", HttpStatus.BAD_GATEWAY),
    OPENAI_API_PROMPT_NOT_FOUND("CB002", "이미지 생성 프롬프트 파일을 찾을 수 없습니다.", HttpStatus.NOT_FOUND),
    OPENAI_API_PROMPT_EMPTY("CB003", "이미지 생성 프롬프트가 비어있습니다.", HttpStatus.BAD_REQUEST),
    OPENAI_API_IMAGE_DATA_EMPTY("CB004", "분석을 위한 이미지가 비어있습니다.", HttpStatus.BAD_REQUEST),
    OPENAI_API_IMAGE_DOWNLOAD_FAILED("CB005", "캐릭터 이미지 다운로드 실패했습니다.", HttpStatus.BAD_GATEWAY),
    OPENAI_API_S3_SAVE_FAILED("CB006", "S3에 이미지 저장 실패", HttpStatus.INSUFFICIENT_STORAGE),
    OPENAI_API_DB_SAVE_FAILED("CB007", "DB에 URL 저장 실패", HttpStatus.INTERNAL_SERVER_ERROR),
    OPENAI_API_REQUEST_NOT_FOUND_BODY("CB008", "GPT 응답 바디가 존재하지 않습니다.", HttpStatus.INTERNAL_SERVER_ERROR),

    // ==================== Attendance ====================
    ALREADY_CHECKED_IN("A001", "오늘 이미 출석 체크를 하셨습니다.", HttpStatus.CONFLICT),

    // ==================== Chatbot ====================
    OPENAI_API_CHOICES_EMPTY("CB009", "GPT가 보낸 리스트를 찾을 수 없음(GPT 호출 및 파싱)", HttpStatus.INTERNAL_SERVER_ERROR),
    OPENAI_API_MESSAGE_NOT_FOUND("CB010", "GPT가 보낸 메시지를 찾을 수 없음(GPT 호출 및 파싱)", HttpStatus.INTERNAL_SERVER_ERROR),
    OPENAI_API_CONTENT_EMPTY("CB011", "GPT가 보낸 메시지의 내용을 찾을 수 없음(GPT 호출 및 파싱)", HttpStatus.INTERNAL_SERVER_ERROR),

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