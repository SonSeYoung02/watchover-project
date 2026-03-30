package com.chh.watchover.controller;

import com.chh.watchover.dto.ApiResponse;
import com.chh.watchover.dto.community.*;
import com.chh.watchover.service.CommunityService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;

@RestController
@RequestMapping("/api/community")
public class CommunityController {

    private final CommunityService communityService;

    @Autowired
    public CommunityController(CommunityService communityService) {
        this.communityService = communityService;
    }

    /*
    =====================================================================
    1. 게시물 생성
    - SpringSecurity에서 현재 로그인된 ID를 찾아서 login 변수에 저장
    - PostWriteRequestDto와 loginId를 communityService에 반환
    =====================================================================
    */
    @PostMapping("/post")
    public ApiResponse<PostWriteResponseDto> postWrite(@Valid @RequestBody PostWriteRequestDto postWriteRequestDto, Principal principal) {
        String loginId = principal.getName();
        return communityService.postWrite(postWriteRequestDto, loginId);
    }

    /*
    =====================================================================
    2. 게시물 수정
    - URL 변수를 CommunityService로 전달
    - postId를 communityService에 반환
    =====================================================================
    */
    @PatchMapping("/post/{postId}")
    public ApiResponse<PostUpdateResponseDto> postUpdate(@PathVariable Long postId, @Valid @RequestBody PostUpdateRequestDto postUpdateRequestDto, Principal principal) {
        String loginId = principal.getName();
        return communityService.postUpdate(postUpdateRequestDto, loginId, postId);
    }


    /*
    =====================================================================
    3. 게시물 삭제
    - URL 변수 postId를 CommunityService로 전달
    - postId를 communityService에 반환
    - 반환값은 없음
    =====================================================================
    */
    @DeleteMapping("/post/{postId}")
    public ApiResponse<Void> postDelete(@PathVariable Long postId) {
        return communityService.postDelete(postId);
    }

    /*
    =====================================================================
    4. 게시물 전체 조회
    - 페이지를 0부터 시작해서 마지막 까지 나눠서 보냄
    - 10개의 post로 쪼개서 Dto에 저장
    =====================================================================
    */
    @GetMapping("/list")
    public ApiResponse<ListPostPageResponseDto> listPost(
            @RequestParam(defaultValue = "0") @Min(0) int page, // 현재 페이지
            @RequestParam(defaultValue = "10") @Min(1) int size // 페이지 크기
            ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return communityService.listPost(pageable);
    }

    /*
    =====================================================================
    5. 게시물에 좋아요 생성
    - 게시물 id를 넣어서 유저의 좋아요 생성
    =====================================================================
    */
    @PostMapping("/post/{postId}/like")
    public ApiResponse<LikePostResponseDto> likePost(@PathVariable Long postId, Principal principal) {
        String loginId = principal.getName();
        return communityService.likePost(postId, loginId);
    }

    /*
    =====================================================================
    6. 게시물 좋아요 순서로 조회
    - 좋아요 순서로 데이터를 보내도록 강제함
    =====================================================================
    */
    @GetMapping("/post/popular")
    public ApiResponse<ListPostPageResponseDto> popularPost(
            @RequestParam(defaultValue = "0") @Min(0) int page,
            @RequestParam(defaultValue = "10") @Min(1) int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("likeCount").descending().and(Sort.by("createdAt").descending()));
        return communityService.popularPost(pageable);
    }

    /*
    =====================================================================
    1. 댓글 작성
    - SpringSecurity에서 현재 로그인된 ID를 찾아서 login 변수에 저장
    - CommentWriteRequestDto와 loginId를 communityService에 반환
    =====================================================================
    */
    @PostMapping("/post/{postId}/comment")
    public ApiResponse<CommentWriteResponseDto> commentWrite(@PathVariable Long postId, @Valid @RequestBody CommentWriteRequestDto commentWriteRequestDto, Principal principal) {
        String loginId = principal.getName();
        return communityService.commentWrite(commentWriteRequestDto, postId, loginId);
    }

    /*
    =====================================================================
    2. 댓글 수정
    - 유저의 로그인 정보 전달
    - DTO, postId, commentId, loginId 반환
    =====================================================================
    */
    @PatchMapping("/post/{postId}/comment/{commentId}")
    public ApiResponse<CommentEditResponseDto> commentEdit(@PathVariable Long postId, @PathVariable Long commentId,@Valid @RequestBody CommentEditRequestDto commentEditRequestDto, Principal principal) {
        String loginId = principal.getName();
        return communityService.commentEdit(commentEditRequestDto, postId, commentId, loginId);
    }

    /*
    =====================================================================
    3. 댓글 전체 조회
    - 유저의 로그인 정보 전달
    =====================================================================
    */
    @GetMapping("/comment")
    public ApiResponse<ListCommentPageResponseDto> listComment(
            @RequestParam(defaultValue = "0") @Min(0) int page,
            @RequestParam(defaultValue = "10") @Min(1) int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return communityService.listComment(pageable);
    }

    /*
    =====================================================================
    1. 북마크 생성
    - 사용자 로그인정보에서 로그인 아이디를 가져옴
    - 게시물 번호와 유저의 로그인 아이디를 전달
    =====================================================================
    */
    @PostMapping("/post/{postId}/bookmark")
    public ApiResponse<BookmarkResponseDto> bookmark(@PathVariable Long postId, Principal principal) {
        String loginId = principal.getName();
        return communityService.bookmark(postId,loginId);
    }

}
