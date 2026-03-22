package com.chh.watchover.controller;

import com.chh.watchover.dto.ApiResponse;
import com.chh.watchover.dto.community.CommentWriteRequestDto;
import com.chh.watchover.dto.community.CommentWriteResponseDto;
import com.chh.watchover.dto.community.PostWriteRequestDto;
import com.chh.watchover.dto.community.PostWriteResponseDto;
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
    - PostWriteRequestDto와 loginId를 반환
    =====================================================================
    */
    @PostMapping("/post/write")
    public ApiResponse<PostWriteResponseDto> postWrite(@Valid @RequestBody PostWriteRequestDto postWriteRequestDto, Principal principal) {
        String loginId = principal.getName();
        return communityService.postWrite(postWriteRequestDto, loginId);
    }

    /*
    =====================================================================
    2. 댓글 작성
    - SpringSecurity에서 현재 로그인된 ID를 찾아서 login 변수에 저장
    - CommentWriteRequestDto와 loginId를 반환
    =====================================================================
    */
    @PostMapping("/post/{postId}/comment")
    public ApiResponse<CommentWriteResponseDto> commentWrite(@PathVariable Long postId, @Valid @RequestBody CommentWriteRequestDto commentWriteRequestDto, Principal principal) {
        String loginId = principal.getName();
        return communityService.commentWrite(postId ,commentWriteRequestDto, loginId);
    }


}
