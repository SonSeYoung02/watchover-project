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
import com.chh.watchover.global.exception.CustomException;
import com.chh.watchover.global.exception.code.ErrorCode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
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
     * 새 게시물을 작성합니다.
     * loginId로 유저를 조회한 뒤 게시물을 저장하고, 작성된 게시물 정보를 반환합니다.
     *
     * @param dto     게시물 작성 요청 DTO (title, content 등)
     * @param loginId 작성자의 loginId
     * @return 생성된 게시물 정보 DTO
     * @throws CustomException USER_NOT_FOUND
     */
    @Transactional
    public PostWriteResponseDto postWrite(PostWriteRequestDto dto, String loginId) {
        UserEntity user = userRepository.findByLoginId(loginId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
        PostEntity post = PostEntity.of(dto, user);
        PostEntity savePost = postRepository.save(post);
        String nickname = user.getNickname();
        return PostWriteResponseDto.from(savePost, nickname);
    }

    /**
     * 기존 게시물을 수정합니다.
     * 게시물 작성자 본인만 제목·내용을 수정할 수 있습니다.
     *
     * @param dto     게시물 수정 요청 DTO (title, content)
     * @param loginId 수정 요청자의 loginId
     * @param postId  수정할 게시물 PK
     * @return 수정된 게시물 정보 DTO
     * @throws CustomException USER_NOT_FOUND / POST_NOT_FOUND / FORBIDDEN_ACCESS
     */
    @Transactional
    public PostUpdateResponseDto postUpdate(PostUpdateRequestDto dto, String loginId, Long postId) {
        UserEntity user = userRepository.findByLoginId(loginId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
        PostEntity post = postRepository.findById(postId)
                .orElseThrow(() -> new CustomException(ErrorCode.POST_NOT_FOUND));
        if (!post.getUser().getLoginId().equals(loginId)) {throw (new CustomException(ErrorCode.FORBIDDEN_ACCESS));}
        post.updatePost(dto.title(), dto.content());
        String nickname = user.getNickname();
        return PostUpdateResponseDto.of(post, nickname);
    }

    /**
     * 게시물을 삭제합니다.
     *
     * @param postId 삭제할 게시물 PK
     * @throws CustomException POST_NOT_FOUND
     */
    @Transactional
    public void postDelete(Long postId) {
        PostEntity post = postRepository.findById(postId)
                .orElseThrow(() -> new CustomException(ErrorCode.POST_NOT_FOUND));
        postRepository.delete(post);
    }

    /**
     * 게시물 상세 정보와 해당 게시물의 댓글 목록을 조회합니다.
     *
     * @param postId 조회할 게시물 PK
     * @return 게시물 상세 정보 및 댓글 목록 DTO
     * @throws CustomException POST_NOT_FOUND
     */
    public PostDetailResponseDto getPostDetail(Long postId) {
        PostEntity post = postRepository.findById(postId)
                .orElseThrow(() -> new CustomException(ErrorCode.POST_NOT_FOUND));
        List<ListCommentResponseDto> comments = commentRepository.findByPost_PostIdOrderByCreatedAtAsc(postId)
                .stream()
                .map(ListCommentResponseDto::from)
                .toList();
        return PostDetailResponseDto.of(post, comments);
    }

    /**
     * 전체 게시물을 최신순으로 페이징하여 조회합니다.
     *
     * @param pageable 페이지 정보 (page, size, sort)
     * @return 페이징된 게시물 목록 DTO
     */
    public ListPostPageResponseDto listPost(Pageable pageable) {
        Page<PostEntity> postPage = postRepository.findAll(pageable);
        return ListPostPageResponseDto.from(postPage);
    }

    /**
     * 게시물 좋아요를 토글합니다.
     * 이미 좋아요가 있으면 취소(likeCount--), 없으면 추가(likeCount++)합니다.
     *
     * @param postId  좋아요를 누를 게시물 PK
     * @param loginId 요청 유저의 loginId
     * @return 좋아요 상태(isLike)와 게시물 ID를 담은 DTO
     * @throws CustomException USER_NOT_FOUND / POST_NOT_FOUND
     */
    @Transactional
    public LikePostResponseDto likePost(Long postId, String loginId) {
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
        return LikePostResponseDto.of(post.getPostId(), isLike);
    }

    /**
     * 게시물을 좋아요 수 내림차순으로 페이징하여 조회합니다.
     * 좋아요 수가 같으면 최신순으로 정렬됩니다.
     *
     * @param pageable 페이지 정보 (page, size, sort)
     * @return 페이징된 인기 게시물 목록 DTO
     */
    public ListPostPageResponseDto popularPost(Pageable pageable) {
        Page<PostEntity> postPage = postRepository.findAll(pageable);
        return ListPostPageResponseDto.from(postPage);
    }

    /**
     * 게시물에 댓글을 작성합니다.
     *
     * @param dto     댓글 작성 요청 DTO (content)
     * @param postId  댓글을 달 게시물 PK
     * @param loginId 작성자의 loginId
     * @return 생성된 댓글 정보 DTO
     * @throws CustomException USER_NOT_FOUND / POST_NOT_FOUND
     */
    @Transactional
    public CommentWriteResponseDto commentWrite(CommentWriteRequestDto dto, Long postId, String loginId) {
        UserEntity user = userRepository.findByLoginId(loginId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
        PostEntity post = postRepository.findById(postId)
                .orElseThrow(() -> new CustomException(ErrorCode.POST_NOT_FOUND));
        CommentEntity comment = CommentEntity.of(dto, user, post);
        CommentEntity saveComment = commentRepository.save(comment);
        return CommentWriteResponseDto.of(saveComment, post, user);
    }

    /**
     * 기존 댓글을 수정합니다.
     * 댓글 작성자 본인만 수정할 수 있으며, 해당 게시물의 댓글인지 검증합니다.
     *
     * @param dto       댓글 수정 요청 DTO (content)
     * @param postId    댓글이 속한 게시물 PK
     * @param commentId 수정할 댓글 PK
     * @param loginId   수정 요청자의 loginId
     * @return 수정된 댓글 정보 DTO
     * @throws CustomException USER_NOT_FOUND / POST_NOT_FOUND / COMMENT_NOT_FOUND / UNAUTHORIZED_USER / COMMENT_NOT_IN_POST
     */
    @Transactional
    public CommentEditResponseDto commentEdit(CommentEditRequestDto dto, Long postId, Long commentId, String loginId) {
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
        return CommentEditResponseDto.of(comment, user, post);
    }

    /**
     * 전체 댓글을 최신순으로 페이징하여 조회합니다.
     *
     * @param pageable 페이지 정보 (page, size, sort)
     * @return 페이징된 댓글 목록 DTO
     */
    public ListCommentPageResponseDto listComment(Pageable pageable) {
        Page<CommentEntity> commentPage = commentRepository.findAll(pageable);
        return ListCommentPageResponseDto.from(commentPage);
    }

    /**
     * 내가 작성한 게시물을 최신순으로 페이징하여 조회합니다.
     */
    public ListPostPageResponseDto myPostList(String loginId, Pageable pageable) {
        userRepository.findByLoginId(loginId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
        Page<PostEntity> postPage = postRepository.findByUser_LoginId(loginId, pageable);
        return ListPostPageResponseDto.from(postPage);
    }

    /**
     * 내가 작성한 댓글을 최신순으로 페이징하여 조회합니다.
     */
    public ListCommentPageResponseDto myCommentList(String loginId, Pageable pageable) {
        userRepository.findByLoginId(loginId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
        Page<CommentEntity> commentPage = commentRepository.findByUser_LoginId(loginId, pageable);
        return ListCommentPageResponseDto.from(commentPage);
    }

    /**
     * 내가 북마크한 게시물을 최신순으로 페이징하여 조회합니다.
     */
    public BookmarkListPageResponseDto myBookmarkList(String loginId, Pageable pageable) {
        UserEntity user = userRepository.findByLoginId(loginId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
        Page<BookmarkEntity> bookmarkPage = bookmarkRepository.findByUser_UserId(user.getUserId(), pageable);
        return BookmarkListPageResponseDto.from(bookmarkPage);
    }

    /**
     * 게시물 북마크를 토글합니다.
     * 이미 북마크가 있으면 취소, 없으면 추가합니다.
     *
     * @param postId  북마크할 게시물 PK
     * @param loginId 요청 유저의 loginId
     * @return 북마크 상태(isBookmark)와 게시물 ID를 담은 DTO
     * @throws CustomException USER_NOT_FOUND / POST_NOT_FOUND
     */
    @Transactional
    public BookmarkResponseDto bookmark(Long postId, String loginId) {
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
        return BookmarkResponseDto.from(postId, isBookmark);
    }

}