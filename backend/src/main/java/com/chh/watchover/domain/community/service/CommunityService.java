package com.chh.watchover.domain.community.service;

import com.chh.watchover.domain.community.model.dto.*;
import com.chh.watchover.domain.community.model.entity.BookmarkEntity;
import com.chh.watchover.domain.community.model.entity.CommentEntity;
import com.chh.watchover.domain.community.model.entity.LikeEntity;
import com.chh.watchover.domain.community.model.entity.PostEntity;
import com.chh.watchover.domain.community.repository.BookmarkRepository;
import com.chh.watchover.domain.community.repository.CommentRepository;
import com.chh.watchover.domain.community.repository.LikeRepository;
import com.chh.watchover.domain.community.repository.PostRepository;
import com.chh.watchover.domain.user.model.entity.UserEntity;
import com.chh.watchover.domain.user.repository.UserRepository;
import com.chh.watchover.global.common.ApiResponse;
import com.chh.watchover.global.exception.CustomException;
import com.chh.watchover.global.exception.code.ErrorCode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class CommunityService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final CommentRepository commentRepository;
    private final BookmarkRepository bookmarkRepository;
    private final LikeRepository likeRepository;

    @Autowired
    public CommunityService(
            PostRepository postRepository,
            UserRepository userRepository,
            CommentRepository commentRepository,
            BookmarkRepository bookmarkRepository,
            LikeRepository likeRepository
    ) {
        this.postRepository = postRepository;
        this.userRepository = userRepository;
        this.commentRepository = commentRepository;
        this.bookmarkRepository = bookmarkRepository;
        this.likeRepository = likeRepository;
    }

    /**
     * 새 게시물을 작성하고 저장합니다.
     *
     * @param dto     게시물 작성 요청 정보 (제목, 내용 등)
     * @param loginId 게시물을 작성하는 사용자의 로그인 아이디
     * @return 작성된 게시물 정보를 담은 표준 응답
     * @throws CustomException 해당 로그인 아이디의 사용자가 존재하지 않는 경우
     */
    @Transactional
    public ApiResponse<PostWriteResponseDto> postWrite(PostWriteRequestDto dto, String loginId) {
        UserEntity user = userRepository.findByLoginId(loginId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
        PostEntity post = PostEntity.of(dto, user);
        PostEntity savePost = postRepository.save(post);
        String nickname = user.getNickname();
        PostWriteResponseDto postWriteResponseDto = PostWriteResponseDto.from(savePost, nickname);
        return ApiResponse.success(postWriteResponseDto);
    }

    /**
     * 기존 게시물의 제목과 내용을 수정합니다. 작성자 본인만 수정할 수 있습니다.
     *
     * @param dto     게시물 수정 요청 정보 (제목, 내용)
     * @param loginId 수정을 요청하는 사용자의 로그인 아이디
     * @param postId  수정할 게시물의 고유 ID
     * @return 수정된 게시물 정보를 담은 표준 응답
     * @throws CustomException 사용자 또는 게시물이 존재하지 않거나 작성자가 아닌 경우
     */
    @Transactional
    public ApiResponse<PostUpdateResponseDto> postUpdate(PostUpdateRequestDto dto,String loginId, Long postId) {
        UserEntity user = userRepository.findByLoginId(loginId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
        PostEntity post = postRepository.findById(postId)
                .orElseThrow(() -> new CustomException(ErrorCode.POST_NOT_FOUND));
        if (!post.getUser().getLoginId().equals(loginId)) {throw (new CustomException(ErrorCode.FORBIDDEN_ACCESS));}
        post.updatePost(dto.title(), dto.content());
        String nickname = user.getNickname();
        PostUpdateResponseDto postUpdateResponseDto = PostUpdateResponseDto.of(post, nickname);
        return ApiResponse.success(postUpdateResponseDto);
    }

    /**
     * 게시물 ID에 해당하는 게시물을 삭제합니다.
     *
     * @param postId 삭제할 게시물의 고유 ID
     * @return 데이터 없이 성공만을 나타내는 표준 응답
     * @throws CustomException 해당 ID의 게시물이 존재하지 않는 경우
     */
    @Transactional
    public ApiResponse<Void> postDelete(Long postId) {
        PostEntity post = postRepository.findById(postId)
                .orElseThrow(() -> new CustomException(ErrorCode.POST_NOT_FOUND));
        postRepository.delete(post);
        return ApiResponse.success(null);
    }

    /**
     * 전체 게시물을 페이징하여 조회합니다.
     *
     * @param pageable 페이지 번호, 크기, 정렬 기준을 담은 페이징 정보
     * @return 페이징된 게시물 목록을 담은 표준 응답
     */
    public ApiResponse<ListPostPageResponseDto> listPost(Pageable pageable) {
        Page<PostEntity> postPage = postRepository.findAll(pageable);
        ListPostPageResponseDto pageDto = ListPostPageResponseDto.from(postPage);
        return ApiResponse.success(pageDto);
    }

    /**
     * 게시물에 좋아요를 토글합니다. 이미 좋아요가 되어 있으면 취소하고, 없으면 추가합니다.
     *
     * @param postId  좋아요를 토글할 게시물의 고유 ID
     * @param loginId 요청하는 사용자의 로그인 아이디
     * @return 좋아요 처리 결과(게시물 ID, 현재 좋아요 상태)를 담은 표준 응답
     * @throws CustomException 사용자 또는 게시물이 존재하지 않는 경우
     */
    @Transactional
    public ApiResponse<LikePostResponseDto> likePost(Long postId, String loginId) {
        UserEntity user = userRepository.findByLoginId(loginId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
        PostEntity post = postRepository.findById(postId)
                .orElseThrow(() -> new CustomException(ErrorCode.POST_NOT_FOUND));
        Optional<LikeEntity> likeOpt = likeRepository.findByUser_UserIdAndPost_PostId(user.getUserId(), post.getPostId());
        boolean isLike;
        if (likeOpt.isPresent()) {
            likeRepository.delete(likeOpt.get());
            post.subtractLike();
            isLike = false;
        } else {
            LikeEntity like = LikeEntity.of(user,post);
            likeRepository.save(like);
            post.addLike();
            isLike = true;
        }
        LikePostResponseDto dto = LikePostResponseDto.of(post.getPostId(), isLike);
        return ApiResponse.success(dto);
    }

    /**
     * 게시물을 인기순으로 페이징하여 조회합니다.
     *
     * @param pageable 페이지 번호, 크기, 정렬 기준을 담은 페이징 정보
     * @return 페이징된 게시물 목록을 담은 표준 응답
     */
    public ApiResponse<ListPostPageResponseDto> popularPost(Pageable pageable) {
        Page<PostEntity> postPage = postRepository.findAll(pageable);
        ListPostPageResponseDto pageDto = ListPostPageResponseDto.from(postPage);
        return ApiResponse.success(pageDto);
    }

    /**
     * 특정 게시물에 댓글을 작성하고 저장합니다.
     *
     * @param dto     댓글 작성 요청 정보 (댓글 내용 등)
     * @param postId  댓글을 작성할 게시물의 고유 ID
     * @param loginId 댓글을 작성하는 사용자의 로그인 아이디
     * @return 작성된 댓글 정보를 담은 표준 응답
     * @throws CustomException 사용자 또는 게시물이 존재하지 않는 경우
     */
    @Transactional
    public ApiResponse<CommentWriteResponseDto> commentWrite(CommentWriteRequestDto dto, Long postId, String loginId) {
        UserEntity user = userRepository.findByLoginId(loginId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
        PostEntity post = postRepository.findById(postId)
                .orElseThrow(() -> new CustomException(ErrorCode.POST_NOT_FOUND));
        CommentEntity comment = CommentEntity.of(dto, user, post);
        CommentEntity saveComment = commentRepository.save(comment);
        CommentWriteResponseDto commentWriteResponseDto = CommentWriteResponseDto.of(saveComment, post, user);
        return ApiResponse.success(commentWriteResponseDto);
    }

    /**
     * 특정 게시물의 댓글을 수정합니다. 댓글 작성자 본인만 수정할 수 있습니다.
     *
     * @param dto       댓글 수정 요청 정보 (수정할 내용)
     * @param postId    댓글이 속한 게시물의 고유 ID
     * @param commentId 수정할 댓글의 고유 ID
     * @param loginId   수정을 요청하는 사용자의 로그인 아이디
     * @return 수정된 댓글 정보를 담은 표준 응답
     * @throws CustomException 사용자·게시물·댓글이 존재하지 않거나, 작성자가 아니거나, 댓글이 해당 게시물에 속하지 않는 경우
     */
    @Transactional
    public ApiResponse<CommentEditResponseDto> commentEdit(CommentEditRequestDto dto, Long postId, Long commentId, String loginId) {
        UserEntity user = userRepository.findByLoginId(loginId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
        PostEntity post = postRepository.findById(postId)
                .orElseThrow(() -> new CustomException(ErrorCode.POST_NOT_FOUND));
        CommentEntity comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new CustomException(ErrorCode.COMMENT_NOT_FOUND));

        if (!comment.getUser().equals(user)) {
            throw new CustomException(ErrorCode.UNAUTHORIZED_USER);
        }
        if (!comment.getPost().getPostId().equals(post.getPostId())) {
            throw new CustomException(ErrorCode.COMMENT_NOT_IN_POST);
        }
        comment.updateComment(dto);
        CommentEditResponseDto commentEditResponseDto = CommentEditResponseDto.of(comment, user, post);
        return ApiResponse.success(commentEditResponseDto);
    }

    /**
     * 전체 댓글을 페이징하여 조회합니다.
     *
     * @param pageable 페이지 번호, 크기, 정렬 기준을 담은 페이징 정보
     * @return 페이징된 댓글 목록을 담은 표준 응답
     */
    public ApiResponse<ListCommentPageResponseDto> listComment(Pageable pageable) {
        Page<CommentEntity> commentPage = commentRepository.findAll(pageable);
        ListCommentPageResponseDto pageDto = ListCommentPageResponseDto.from(commentPage);
        return ApiResponse.success(pageDto);
    }

    /**
     * 게시물에 북마크를 토글합니다. 이미 북마크가 되어 있으면 취소하고, 없으면 추가합니다.
     *
     * @param postId  북마크를 토글할 게시물의 고유 ID
     * @param loginId 요청하는 사용자의 로그인 아이디
     * @return 북마크 처리 결과(게시물 ID, 현재 북마크 상태)를 담은 표준 응답
     * @throws CustomException 사용자 또는 게시물이 존재하지 않는 경우
     */
    @Transactional
    public ApiResponse<BookmarkResponseDto> bookmark(Long postId, String loginId) {
        UserEntity user = userRepository.findByLoginId(loginId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
        PostEntity post = postRepository.findById(postId)
                .orElseThrow(() -> new CustomException(ErrorCode.POST_NOT_FOUND));
        Optional<BookmarkEntity> bookmarkOpt = bookmarkRepository.findByUser_userIdAndPost_postId(user.getUserId(), post.getPostId());
        boolean isBookmark;
        if (bookmarkOpt.isPresent()) {
            bookmarkRepository.delete(bookmarkOpt.get());
            isBookmark = false;
        } else {
            BookmarkEntity newBookmark = BookmarkEntity.createBookmark(user,post);
            bookmarkRepository.save(newBookmark);
            isBookmark = true;
        }
        BookmarkResponseDto dto = BookmarkResponseDto.from(postId, isBookmark);
        return ApiResponse.success(dto);
    }

}
