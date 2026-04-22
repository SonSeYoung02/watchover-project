package com.chh.watchover.domain.community.controller;

import com.chh.watchover.domain.community.model.dto.*;
import com.chh.watchover.global.common.ApiResponse;
import com.chh.watchover.domain.community.service.CommunityService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;

@Tag(name = "Community", description = "커뮤니티 게시물/댓글/북마크 API")
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
    /**
     * 현재 로그인된 사용자가 새 게시물을 작성한다.
     *
     * @param postWriteRequestDto 게시물 작성에 필요한 내용 DTO
     * @param principal           현재 인증된 사용자 정보 (Spring Security 제공)
     * @return 작성된 게시물 정보를 담은 ApiResponse
     */
    @Operation(summary = "게시물 작성")
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
    /**
     * 특정 게시물의 내용을 수정한다.
     *
     * @param postId              수정할 게시물의 고유 식별자
     * @param postUpdateRequestDto 수정할 게시물 내용 DTO
     * @param principal           현재 인증된 사용자 정보 (Spring Security 제공)
     * @return 수정된 게시물 정보를 담은 ApiResponse
     */
    @Operation(summary = "게시물 수정")
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
    /**
     * 특정 게시물을 삭제한다.
     *
     * @param postId 삭제할 게시물의 고유 식별자
     * @return 삭제 처리 결과를 담은 ApiResponse (반환 데이터 없음)
     */
    @Operation(summary = "게시물 삭제")
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
    /**
     * 전체 게시물 목록을 페이지 단위로 조회한다.
     *
     * @param page 조회할 페이지 번호 (0부터 시작, 기본값 0)
     * @param size 페이지당 게시물 수 (기본값 10)
     * @return 페이지 정보와 게시물 목록을 담은 ApiResponse
     */
    @Operation(summary = "게시물 전체 조회")
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
    /**
     * 특정 게시물에 좋아요를 추가한다.
     *
     * @param postId    좋아요를 추가할 게시물의 고유 식별자
     * @param principal 현재 인증된 사용자 정보 (Spring Security 제공)
     * @return 좋아요 처리 결과를 담은 ApiResponse
     */
    @Operation(summary = "게시물 좋아요")
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
    /**
     * 좋아요 수 기준으로 인기 게시물 목록을 페이지 단위로 조회한다.
     *
     * @param page 조회할 페이지 번호 (0부터 시작, 기본값 0)
     * @param size 페이지당 게시물 수 (기본값 10)
     * @return 인기 순으로 정렬된 게시물 목록을 담은 ApiResponse
     */
    @Operation(summary = "인기 게시물 조회")
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
    /**
     * 특정 게시물에 댓글을 작성한다.
     *
     * @param postId                 댓글을 작성할 게시물의 고유 식별자
     * @param commentWriteRequestDto 댓글 작성에 필요한 내용 DTO
     * @param principal              현재 인증된 사용자 정보 (Spring Security 제공)
     * @return 작성된 댓글 정보를 담은 ApiResponse
     */
    @Operation(summary = "댓글 작성")
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
    /**
     * 특정 게시물의 댓글을 수정한다.
     *
     * @param postId               댓글이 속한 게시물의 고유 식별자
     * @param commentId            수정할 댓글의 고유 식별자
     * @param commentEditRequestDto 수정할 댓글 내용 DTO
     * @param principal            현재 인증된 사용자 정보 (Spring Security 제공)
     * @return 수정된 댓글 정보를 담은 ApiResponse
     */
    @Operation(summary = "댓글 수정")
    @PatchMapping("/post/{postId}/comment/{commentId}")
    public ApiResponse<CommentEditResponseDto> commentEdit(@PathVariable Long postId, @PathVariable Long commentId, @Valid @RequestBody CommentEditRequestDto commentEditRequestDto, Principal principal) {
        String loginId = principal.getName();
        return communityService.commentEdit(commentEditRequestDto, postId, commentId, loginId);
    }

    /*
    =====================================================================
    3. 댓글 전체 조회
    - 유저의 로그인 정보 전달
    =====================================================================
    */
    /**
     * 전체 댓글 목록을 페이지 단위로 조회한다.
     *
     * @param page 조회할 페이지 번호 (0부터 시작, 기본값 0)
     * @param size 페이지당 댓글 수 (기본값 10)
     * @return 페이지 정보와 댓글 목록을 담은 ApiResponse
     */
    @Operation(summary = "댓글 전체 조회")
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
    /**
     * 특정 게시물에 대한 북마크를 추가하거나 제거한다 (토글).
     *
     * @param postId    북마크 대상 게시물의 고유 식별자
     * @param principal 현재 인증된 사용자 정보 (Spring Security 제공)
     * @return 북마크 처리 결과를 담은 ApiResponse
     */
    @Operation(summary = "북마크 토글")
    @PostMapping("/post/{postId}/bookmark")
    public ApiResponse<BookmarkResponseDto> bookmark(@PathVariable Long postId, Principal principal) {
        String loginId = principal.getName();
        return communityService.bookmark(postId,loginId);
    }

}
