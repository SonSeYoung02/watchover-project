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

    /**
     * 게시물 작성 API.
     * 현재 로그인된 유저로 새 게시물을 생성합니다.
     *
     * @param postWriteRequestDto 게시물 작성 요청 DTO (title, content 등)
     * @param principal           현재 인증 유저 정보
     * @return 생성된 게시물 정보를 담은 표준 응답
     */
    @Operation(summary = "게시물 작성")
    @PostMapping("/post")
    public ApiResponse<PostWriteResponseDto> postWrite(@Valid @RequestBody PostWriteRequestDto postWriteRequestDto, Principal principal) {
        String loginId = principal.getName();
        return ApiResponse.success(communityService.postWrite(postWriteRequestDto, loginId));
    }

    /**
     * 게시물 수정 API.
     * 게시물 작성자 본인만 제목·내용을 수정할 수 있습니다.
     *
     * @param postId              수정할 게시물 PK
     * @param postUpdateRequestDto 수정 요청 DTO (title, content)
     * @param principal           현재 인증 유저 정보
     * @return 수정된 게시물 정보를 담은 표준 응답
     */
    @Operation(summary = "게시물 수정")
    @PatchMapping("/post/{postId}")
    public ApiResponse<PostUpdateResponseDto> postUpdate(@PathVariable Long postId, @Valid @RequestBody PostUpdateRequestDto postUpdateRequestDto, Principal principal) {
        String loginId = principal.getName();
        return ApiResponse.success(communityService.postUpdate(postUpdateRequestDto, loginId, postId));
    }

    /**
     * 게시물 삭제 API.
     * 지정한 게시물을 삭제합니다.
     *
     * @param postId 삭제할 게시물 PK
     * @return 데이터 없이 성공을 나타내는 표준 응답
     */
    @Operation(summary = "게시물 삭제")
    @DeleteMapping("/post/{postId}")
    public ApiResponse<Void> postDelete(@PathVariable Long postId) {
        communityService.postDelete(postId);
        return ApiResponse.success(null);
    }

    /**
     * 게시물 상세 조회 API.
     * 게시물 정보와 해당 게시물의 댓글 목록을 반환합니다.
     *
     * @param postId 조회할 게시물 PK
     * @return 게시물 상세 정보 및 댓글 목록을 담은 표준 응답
     */
    @GetMapping("/post/{postId}")
    public ApiResponse<PostDetailResponseDto> getPostDetail(@PathVariable Long postId) {
        return ApiResponse.success(communityService.getPostDetail(postId));
    }

    /**
     * 게시물 전체 조회 API.
     * 최신순으로 페이징된 게시물 목록을 반환합니다.
     *
     * @param page 현재 페이지 번호 (0부터 시작, 기본값 0)
     * @param size 페이지당 게시물 수 (기본값 10)
     * @return 페이징된 게시물 목록을 담은 표준 응답
     */
    @Operation(summary = "게시물 전체 조회")
    @GetMapping("/list")
    public ApiResponse<ListPostPageResponseDto> listPost(
            @RequestParam(defaultValue = "0") @Min(0) int page,
            @RequestParam(defaultValue = "10") @Min(1) int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return ApiResponse.success(communityService.listPost(pageable));
    }

    /**
     * 게시물 좋아요 토글 API.
     * 좋아요가 없으면 추가, 이미 있으면 취소합니다.
     *
     * @param postId    좋아요를 누를 게시물 PK
     * @param principal 현재 인증 유저 정보
     * @return 좋아요 상태(isLike)와 게시물 ID를 담은 표준 응답
     */
    @Operation(summary = "게시물 좋아요")
    @PostMapping("/post/{postId}/like")
    public ApiResponse<LikePostResponseDto> likePost(@PathVariable Long postId, Principal principal) {
        String loginId = principal.getName();
        return ApiResponse.success(communityService.likePost(postId, loginId));
    }

    /**
     * 인기 게시물 조회 API.
     * 좋아요 수 내림차순, 동점 시 최신순으로 페이징된 게시물 목록을 반환합니다.
     *
     * @param page 현재 페이지 번호 (0부터 시작, 기본값 0)
     * @param size 페이지당 게시물 수 (기본값 10)
     * @return 페이징된 인기 게시물 목록을 담은 표준 응답
     */
    @Operation(summary = "인기 게시물 조회")
    @GetMapping("/post/popular")
    public ApiResponse<ListPostPageResponseDto> popularPost(
            @RequestParam(defaultValue = "0") @Min(0) int page,
            @RequestParam(defaultValue = "10") @Min(1) int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("likeCount").descending().and(Sort.by("createdAt").descending()));
        return ApiResponse.success(communityService.popularPost(pageable));
    }

    /**
     * 댓글 작성 API.
     * 지정한 게시물에 댓글을 작성합니다.
     *
     * @param postId                 댓글을 달 게시물 PK
     * @param commentWriteRequestDto 댓글 작성 요청 DTO (content)
     * @param principal              현재 인증 유저 정보
     * @return 생성된 댓글 정보를 담은 표준 응답
     */
    @Operation(summary = "댓글 작성")
    @PostMapping("/post/{postId}/comment")
    public ApiResponse<CommentWriteResponseDto> commentWrite(@PathVariable Long postId, @Valid @RequestBody CommentWriteRequestDto commentWriteRequestDto, Principal principal) {
        String loginId = principal.getName();
        return ApiResponse.success(communityService.commentWrite(commentWriteRequestDto, postId, loginId));
    }

    /**
     * 댓글 수정 API.
     * 댓글 작성자 본인만 내용을 수정할 수 있습니다.
     *
     * @param postId               댓글이 속한 게시물 PK
     * @param commentId            수정할 댓글 PK
     * @param commentEditRequestDto 댓글 수정 요청 DTO (content)
     * @param principal            현재 인증 유저 정보
     * @return 수정된 댓글 정보를 담은 표준 응답
     */
    @Operation(summary = "댓글 수정")
    @PatchMapping("/post/{postId}/comment/{commentId}")
    public ApiResponse<CommentEditResponseDto> commentEdit(@PathVariable Long postId, @PathVariable Long commentId, @Valid @RequestBody CommentEditRequestDto commentEditRequestDto, Principal principal) {
        String loginId = principal.getName();
        return ApiResponse.success(communityService.commentEdit(commentEditRequestDto, postId, commentId, loginId));
    }

    /**
     * 댓글 전체 조회 API.
     * 최신순으로 페이징된 전체 댓글 목록을 반환합니다.
     *
     * @param page 현재 페이지 번호 (0부터 시작, 기본값 0)
     * @param size 페이지당 댓글 수 (기본값 10)
     * @return 페이징된 댓글 목록을 담은 표준 응답
     */
    @Operation(summary = "댓글 전체 조회")
    @GetMapping("/comment")
    public ApiResponse<ListCommentPageResponseDto> listComment(
            @RequestParam(defaultValue = "0") @Min(0) int page,
            @RequestParam(defaultValue = "10") @Min(1) int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return ApiResponse.success(communityService.listComment(pageable));
    }

    /**
     * 북마크 토글 API.
     * 북마크가 없으면 추가, 이미 있으면 취소합니다.
     *
     * @param postId    북마크할 게시물 PK
     * @param principal 현재 인증 유저 정보
     * @return 북마크 상태(isBookmark)와 게시물 ID를 담은 표준 응답
     */
    @Operation(summary = "북마크 토글")
    @PostMapping("/post/{postId}/bookmark")
    public ApiResponse<BookmarkResponseDto> bookmark(@PathVariable Long postId, Principal principal) {
        String loginId = principal.getName();
        return ApiResponse.success(communityService.bookmark(postId, loginId));
    }

}