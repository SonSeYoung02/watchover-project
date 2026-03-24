package com.chh.watchover.controller;

import com.chh.watchover.dto.ApiResponse;
import com.chh.watchover.dto.community.*;
import com.chh.watchover.service.CommunityService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
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
    1. 게시물 작성
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
    =====================================================================
    */
    @DeleteMapping("/post/{postId}")
    public ApiResponse<Void> postDelete(@PathVariable Long postId) {
        return communityService.postDelete(postId);
    }

    /*
    =====================================================================
    2. 댓글 작성
    - SpringSecurity에서 현재 로그인된 ID를 찾아서 login 변수에 저장
    - CommentWriteRequestDto와 loginId를 communityService에 반환
    =====================================================================
    */
    @PostMapping("/post/{postId}/comment")
    public ApiResponse<CommentWriteResponseDto> commentWrite(@PathVariable Long postId, @Valid @RequestBody CommentWriteRequestDto commentWriteRequestDto, Principal principal) {
        String loginId = principal.getName();
        return communityService.commentWrite(commentWriteRequestDto, postId, loginId);
    }


}
