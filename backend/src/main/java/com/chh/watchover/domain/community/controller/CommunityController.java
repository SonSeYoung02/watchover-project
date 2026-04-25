package com.chh.watchover.domain.community.controller;

import com.chh.watchover.domain.community.model.dto.*;
import com.chh.watchover.global.common.ApiResponse;
import com.chh.watchover.domain.community.service.CommunityService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
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

    @Operation(summary = "게시물 작성", description = "로그인된 유저로 새 게시물을 생성합니다.")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "게시물 작성 성공"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "유효성 검사 실패"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "인증 실패")
    })
    @PostMapping("/post")
    public ApiResponse<PostWriteResponseDto> postWrite(
            @Valid @RequestBody PostWriteRequestDto postWriteRequestDto,
            Principal principal) {
        String loginId = principal.getName();
        return ApiResponse.success(communityService.postWrite(postWriteRequestDto, loginId));
    }

    @Operation(summary = "게시물 수정", description = "게시물 작성자 본인만 제목·내용을 수정할 수 있습니다.")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "게시물 수정 성공"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "유효성 검사 실패"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "수정 권한 없음"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "게시물 없음")
    })
    @PatchMapping("/post/{postId}")
    public ApiResponse<PostUpdateResponseDto> postUpdate(
            @Parameter(description = "수정할 게시물 ID", required = true) @PathVariable Long postId,
            @Valid @RequestBody PostUpdateRequestDto postUpdateRequestDto,
            Principal principal) {
        String loginId = principal.getName();
        return ApiResponse.success(communityService.postUpdate(postUpdateRequestDto, loginId, postId));
    }

    @Operation(summary = "게시물 삭제", description = "지정한 게시물을 삭제합니다.")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "게시물 삭제 성공"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "게시물 없음")
    })
    @DeleteMapping("/post/{postId}")
    public ApiResponse<Void> postDelete(
            @Parameter(description = "삭제할 게시물 ID", required = true) @PathVariable Long postId) {
        communityService.postDelete(postId);
        return ApiResponse.success(null);
    }

    @Operation(summary = "게시물 상세 조회", description = "게시물 정보와 댓글 목록을 반환합니다.")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "조회 성공"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "게시물 없음")
    })
    @GetMapping("/post/{postId}")
    public ApiResponse<PostDetailResponseDto> getPostDetail(
            @Parameter(description = "조회할 게시물 ID", required = true) @PathVariable Long postId) {
        return ApiResponse.success(communityService.getPostDetail(postId));
    }

    @Operation(summary = "게시물 전체 조회", description = "최신순으로 페이징된 게시물 목록을 반환합니다.")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "조회 성공")
    })
    @GetMapping("/list")
    public ApiResponse<ListPostPageResponseDto> listPost(
            @Parameter(description = "페이지 번호 (0부터 시작)", example = "0") @RequestParam(defaultValue = "0") @Min(0) int page,
            @Parameter(description = "페이지당 게시물 수", example = "10") @RequestParam(defaultValue = "10") @Min(1) int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return ApiResponse.success(communityService.listPost(pageable));
    }

    @Operation(summary = "게시물 좋아요 토글", description = "좋아요가 없으면 추가, 이미 있으면 취소합니다.")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "좋아요 토글 성공"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "게시물 없음")
    })
    @PostMapping("/post/{postId}/like")
    public ApiResponse<LikePostResponseDto> likePost(
            @Parameter(description = "좋아요를 누를 게시물 ID", required = true) @PathVariable Long postId,
            Principal principal) {
        String loginId = principal.getName();
        return ApiResponse.success(communityService.likePost(postId, loginId));
    }

    @Operation(summary = "인기 게시물 조회", description = "좋아요 수 내림차순, 동점 시 최신순으로 페이징된 게시물 목록을 반환합니다.")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "조회 성공")
    })
    @GetMapping("/post/popular")
    public ApiResponse<ListPostPageResponseDto> popularPost(
            @Parameter(description = "페이지 번호 (0부터 시작)", example = "0") @RequestParam(defaultValue = "0") @Min(0) int page,
            @Parameter(description = "페이지당 게시물 수", example = "10") @RequestParam(defaultValue = "10") @Min(1) int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("likeCount").descending().and(Sort.by("createdAt").descending()));
        return ApiResponse.success(communityService.popularPost(pageable));
    }

    @Operation(summary = "댓글 작성", description = "지정한 게시물에 댓글을 작성합니다.")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "댓글 작성 성공"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "유효성 검사 실패"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "게시물 없음")
    })
    @PostMapping("/post/{postId}/comment")
    public ApiResponse<CommentWriteResponseDto> commentWrite(
            @Parameter(description = "댓글을 달 게시물 ID", required = true) @PathVariable Long postId,
            @Valid @RequestBody CommentWriteRequestDto commentWriteRequestDto,
            Principal principal) {
        String loginId = principal.getName();
        return ApiResponse.success(communityService.commentWrite(commentWriteRequestDto, postId, loginId));
    }

    @Operation(summary = "댓글 수정", description = "댓글 작성자 본인만 내용을 수정할 수 있습니다.")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "댓글 수정 성공"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "수정 권한 없음"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "댓글 또는 게시물 없음")
    })
    @PatchMapping("/post/{postId}/comment/{commentId}")
    public ApiResponse<CommentEditResponseDto> commentEdit(
            @Parameter(description = "게시물 ID", required = true) @PathVariable Long postId,
            @Parameter(description = "수정할 댓글 ID", required = true) @PathVariable Long commentId,
            @Valid @RequestBody CommentEditRequestDto commentEditRequestDto,
            Principal principal) {
        String loginId = principal.getName();
        return ApiResponse.success(communityService.commentEdit(commentEditRequestDto, postId, commentId, loginId));
    }

    @Operation(summary = "댓글 전체 조회", description = "최신순으로 페이징된 전체 댓글 목록을 반환합니다.")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "조회 성공")
    })
    @GetMapping("/comment")
    public ApiResponse<ListCommentPageResponseDto> listComment(
            @Parameter(description = "페이지 번호 (0부터 시작)", example = "0") @RequestParam(defaultValue = "0") @Min(0) int page,
            @Parameter(description = "페이지당 댓글 수", example = "10") @RequestParam(defaultValue = "10") @Min(1) int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return ApiResponse.success(communityService.listComment(pageable));
    }

    @Operation(summary = "북마크 토글", description = "북마크가 없으면 추가, 이미 있으면 취소합니다.")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "북마크 토글 성공"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "게시물 없음")
    })
    @PostMapping("/post/{postId}/bookmark")
    public ApiResponse<BookmarkResponseDto> bookmark(
            @Parameter(description = "북마크할 게시물 ID", required = true) @PathVariable Long postId,
            Principal principal) {
        String loginId = principal.getName();
        return ApiResponse.success(communityService.bookmark(postId, loginId));
    }
}