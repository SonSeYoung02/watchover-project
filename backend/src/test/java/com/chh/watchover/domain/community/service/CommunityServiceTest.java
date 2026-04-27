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
import com.chh.watchover.domain.user.model.type.Gender;
import com.chh.watchover.domain.user.repository.UserRepository;
import com.chh.watchover.global.exception.CustomException;
import com.chh.watchover.global.exception.code.ErrorCode;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class CommunityServiceTest {

    @Mock private PostRepository postRepository;
    @Mock private UserRepository userRepository;
    @Mock private CommentRepository commentRepository;
    @Mock private BookmarkRepository bookmarkRepository;
    @Mock private LikeRepository likeRepository;

    @InjectMocks
    private CommunityService communityService;

    private UserEntity user;
    private PostEntity post;

    @BeforeEach
    void setUp() {
        user = UserEntity.builder()
                .loginId("testuser")
                .loginPw("encoded")
                .email("test@example.com")
                .nickname("테스터")
                .gender(Gender.M)
                .build();

        post = PostEntity.builder()
                .user(user)
                .title("테스트 제목")
                .content("테스트 내용")
                .build();
        ReflectionTestUtils.setField(post, "postId", 1L);
    }

    // ─── postWrite ───────────────────────────────────────────────────────────

    @Test
    void postWrite_savesPostAndReturnsDto_whenUserExists() {
        PostWriteRequestDto dto = new PostWriteRequestDto("제목", "내용");
        given(userRepository.findByLoginId("testuser")).willReturn(Optional.of(user));
        given(postRepository.save(any(PostEntity.class))).willReturn(post);

        PostWriteResponseDto result = communityService.postWrite(dto, "testuser");

        assertThat(result).isNotNull();
        verify(postRepository).save(any(PostEntity.class));
    }

    @Test
    void postWrite_throwsUserNotFound_whenUserDoesNotExist() {
        PostWriteRequestDto dto = new PostWriteRequestDto("제목", "내용");
        given(userRepository.findByLoginId("ghost")).willReturn(Optional.empty());

        assertThatThrownBy(() -> communityService.postWrite(dto, "ghost"))
                .isInstanceOf(CustomException.class)
                .satisfies(ex -> assertThat(((CustomException) ex).getErrorCode()).isEqualTo(ErrorCode.USER_NOT_FOUND));
    }

    // ─── listPost ─────────────────────────────────────────────────────────────

    @Test
    void listPost_returnsPagedPosts() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<PostEntity> page = new PageImpl<>(List.of(post));
        given(postRepository.findAll(pageable)).willReturn(page);

        ListPostPageResponseDto result = communityService.listPost(pageable);

        assertThat(result).isNotNull();
    }

    @Test
    void listPost_returnsEmptyPage_whenNoPosts() {
        Pageable pageable = PageRequest.of(0, 10);
        given(postRepository.findAll(pageable)).willReturn(Page.empty());

        ListPostPageResponseDto result = communityService.listPost(pageable);

        assertThat(result).isNotNull();
    }

    // ─── getPostDetail ────────────────────────────────────────────────────────

    @Test
    void getPostDetail_returnsDetailWithComments_whenPostExists() {
        given(postRepository.findById(1L)).willReturn(Optional.of(post));
        given(commentRepository.findByPost_PostIdOrderByCreatedAtAsc(1L)).willReturn(List.of());

        PostDetailResponseDto result = communityService.getPostDetail(1L);

        assertThat(result).isNotNull();
    }

    @Test
    void getPostDetail_throwsPostNotFound_whenPostDoesNotExist() {
        given(postRepository.findById(99L)).willReturn(Optional.empty());

        assertThatThrownBy(() -> communityService.getPostDetail(99L))
                .isInstanceOf(CustomException.class)
                .satisfies(ex -> assertThat(((CustomException) ex).getErrorCode()).isEqualTo(ErrorCode.POST_NOT_FOUND));
    }

    // ─── postUpdate ──────────────────────────────────────────────────────────

    @Test
    void postUpdate_updatesPost_whenCallerIsAuthor() {
        PostUpdateRequestDto dto = new PostUpdateRequestDto("새제목", "새내용");
        given(userRepository.findByLoginId("testuser")).willReturn(Optional.of(user));
        given(postRepository.findById(1L)).willReturn(Optional.of(post));

        PostUpdateResponseDto result = communityService.postUpdate(dto, "testuser", 1L);

        assertThat(result).isNotNull();
    }

    @Test
    void postUpdate_throwsForbiddenAccess_whenCallerIsNotAuthor() {
        PostUpdateRequestDto dto = new PostUpdateRequestDto("새제목", "새내용");
        UserEntity otherUser = UserEntity.builder()
                .loginId("other")
                .loginPw("pw")
                .email("other@example.com")
                .nickname("남")
                .gender(Gender.F)
                .build();
        given(userRepository.findByLoginId("other")).willReturn(Optional.of(otherUser));
        given(postRepository.findById(1L)).willReturn(Optional.of(post));

        assertThatThrownBy(() -> communityService.postUpdate(dto, "other", 1L))
                .isInstanceOf(CustomException.class)
                .satisfies(ex -> assertThat(((CustomException) ex).getErrorCode()).isEqualTo(ErrorCode.FORBIDDEN_ACCESS));
    }

    @Test
    void postUpdate_throwsUserNotFound_whenUserDoesNotExist() {
        PostUpdateRequestDto dto = new PostUpdateRequestDto("새제목", "새내용");
        given(userRepository.findByLoginId("ghost")).willReturn(Optional.empty());

        assertThatThrownBy(() -> communityService.postUpdate(dto, "ghost", 1L))
                .isInstanceOf(CustomException.class)
                .satisfies(ex -> assertThat(((CustomException) ex).getErrorCode()).isEqualTo(ErrorCode.USER_NOT_FOUND));
    }

    @Test
    void postUpdate_throwsPostNotFound_whenPostDoesNotExist() {
        PostUpdateRequestDto dto = new PostUpdateRequestDto("새제목", "새내용");
        given(userRepository.findByLoginId("testuser")).willReturn(Optional.of(user));
        given(postRepository.findById(99L)).willReturn(Optional.empty());

        assertThatThrownBy(() -> communityService.postUpdate(dto, "testuser", 99L))
                .isInstanceOf(CustomException.class)
                .satisfies(ex -> assertThat(((CustomException) ex).getErrorCode()).isEqualTo(ErrorCode.POST_NOT_FOUND));
    }

    // ─── postDelete ──────────────────────────────────────────────────────────

    @Test
    void postDelete_deletesPost_whenCallerIsAuthor() {
        given(postRepository.findById(1L)).willReturn(Optional.of(post));

        communityService.postDelete(1L, "testuser");

        verify(postRepository).delete(post);
    }

    @Test
    void postDelete_throwsForbiddenAccess_whenCallerIsNotAuthor() {
        given(postRepository.findById(1L)).willReturn(Optional.of(post));

        assertThatThrownBy(() -> communityService.postDelete(1L, "intruder"))
                .isInstanceOf(CustomException.class)
                .satisfies(ex -> assertThat(((CustomException) ex).getErrorCode()).isEqualTo(ErrorCode.FORBIDDEN_ACCESS));
    }

    @Test
    void postDelete_throwsPostNotFound_whenPostDoesNotExist() {
        given(postRepository.findById(99L)).willReturn(Optional.empty());

        assertThatThrownBy(() -> communityService.postDelete(99L, "testuser"))
                .isInstanceOf(CustomException.class)
                .satisfies(ex -> assertThat(((CustomException) ex).getErrorCode()).isEqualTo(ErrorCode.POST_NOT_FOUND));
    }

    // ─── likePost (toggle) ────────────────────────────────────────────────────

    @Test
    void likePost_addsLike_whenNoExistingLike() {
        given(userRepository.findByLoginId("testuser")).willReturn(Optional.of(user));
        given(postRepository.findById(1L)).willReturn(Optional.of(post));
        given(likeRepository.findByUser_UserIdAndPost_PostId(user.getUserId(), post.getPostId()))
                .willReturn(Optional.empty());
        given(likeRepository.save(any(LikeEntity.class))).willReturn(LikeEntity.of(user, post));

        LikePostResponseDto result = communityService.likePost(1L, "testuser");

        assertThat(result.isLike()).isTrue();
        verify(likeRepository).save(any(LikeEntity.class));
    }

    @Test
    void likePost_removesLike_whenLikeAlreadyExists() {
        LikeEntity existingLike = LikeEntity.of(user, post);
        given(userRepository.findByLoginId("testuser")).willReturn(Optional.of(user));
        given(postRepository.findById(1L)).willReturn(Optional.of(post));
        given(likeRepository.findByUser_UserIdAndPost_PostId(user.getUserId(), post.getPostId()))
                .willReturn(Optional.of(existingLike));

        LikePostResponseDto result = communityService.likePost(1L, "testuser");

        assertThat(result.isLike()).isFalse();
        verify(likeRepository).delete(existingLike);
    }

    @Test
    void likePost_throwsUserNotFound_whenUserDoesNotExist() {
        given(userRepository.findByLoginId("ghost")).willReturn(Optional.empty());

        assertThatThrownBy(() -> communityService.likePost(1L, "ghost"))
                .isInstanceOf(CustomException.class)
                .satisfies(ex -> assertThat(((CustomException) ex).getErrorCode()).isEqualTo(ErrorCode.USER_NOT_FOUND));
    }

    @Test
    void likePost_throwsPostNotFound_whenPostDoesNotExist() {
        given(userRepository.findByLoginId("testuser")).willReturn(Optional.of(user));
        given(postRepository.findById(99L)).willReturn(Optional.empty());

        assertThatThrownBy(() -> communityService.likePost(99L, "testuser"))
                .isInstanceOf(CustomException.class)
                .satisfies(ex -> assertThat(((CustomException) ex).getErrorCode()).isEqualTo(ErrorCode.POST_NOT_FOUND));
    }

    // ─── bookmark (toggle) ────────────────────────────────────────────────────

    @Test
    void bookmark_addsBookmark_whenNoExistingBookmark() {
        given(userRepository.findByLoginId("testuser")).willReturn(Optional.of(user));
        given(postRepository.findById(1L)).willReturn(Optional.of(post));
        given(bookmarkRepository.findByUser_userIdAndPost_postId(user.getUserId(), post.getPostId()))
                .willReturn(Optional.empty());
        given(bookmarkRepository.save(any(BookmarkEntity.class)))
                .willReturn(BookmarkEntity.createBookmark(user, post));

        BookmarkResponseDto result = communityService.bookmark(1L, "testuser");

        assertThat(result.isBookmark()).isTrue();
        verify(bookmarkRepository).save(any(BookmarkEntity.class));
    }

    @Test
    void bookmark_removesBookmark_whenBookmarkAlreadyExists() {
        BookmarkEntity existingBookmark = BookmarkEntity.createBookmark(user, post);
        given(userRepository.findByLoginId("testuser")).willReturn(Optional.of(user));
        given(postRepository.findById(1L)).willReturn(Optional.of(post));
        given(bookmarkRepository.findByUser_userIdAndPost_postId(user.getUserId(), post.getPostId()))
                .willReturn(Optional.of(existingBookmark));

        BookmarkResponseDto result = communityService.bookmark(1L, "testuser");

        assertThat(result.isBookmark()).isFalse();
        verify(bookmarkRepository).delete(existingBookmark);
    }

    // ─── commentWrite ─────────────────────────────────────────────────────────

    @Test
    void commentWrite_savesCommentAndReturnsDto_whenUserAndPostExist() {
        CommentWriteRequestDto dto = new CommentWriteRequestDto("댓글 내용");
        CommentEntity comment = CommentEntity.of(dto, user, post);
        given(userRepository.findByLoginId("testuser")).willReturn(Optional.of(user));
        given(postRepository.findById(1L)).willReturn(Optional.of(post));
        given(commentRepository.save(any(CommentEntity.class))).willReturn(comment);

        CommentWriteResponseDto result = communityService.commentWrite(dto, 1L, "testuser");

        assertThat(result).isNotNull();
        verify(commentRepository).save(any(CommentEntity.class));
    }

    @Test
    void commentWrite_throwsPostNotFound_whenPostDoesNotExist() {
        CommentWriteRequestDto dto = new CommentWriteRequestDto("댓글 내용");
        given(userRepository.findByLoginId("testuser")).willReturn(Optional.of(user));
        given(postRepository.findById(99L)).willReturn(Optional.empty());

        assertThatThrownBy(() -> communityService.commentWrite(dto, 99L, "testuser"))
                .isInstanceOf(CustomException.class)
                .satisfies(ex -> assertThat(((CustomException) ex).getErrorCode()).isEqualTo(ErrorCode.POST_NOT_FOUND));
    }

    // ─── commentEdit ─────────────────────────────────────────────────────────

    @Test
    void commentEdit_updatesComment_whenCallerIsAuthor() {
        CommentEditRequestDto dto = new CommentEditRequestDto("수정된 댓글");
        CommentEntity comment = CommentEntity.builder()
                .user(user)
                .post(post)
                .content("원본 댓글")
                .build();
        given(userRepository.findByLoginId("testuser")).willReturn(Optional.of(user));
        given(postRepository.findById(1L)).willReturn(Optional.of(post));
        given(commentRepository.findById(1L)).willReturn(Optional.of(comment));

        CommentEditResponseDto result = communityService.commentEdit(dto, 1L, 1L, "testuser");

        assertThat(result).isNotNull();
    }

    @Test
    void commentEdit_throwsUnauthorizedUser_whenCallerIsNotCommentAuthor() {
        CommentEditRequestDto dto = new CommentEditRequestDto("수정된 댓글");
        UserEntity otherUser = UserEntity.builder()
                .loginId("other")
                .loginPw("pw")
                .email("other@example.com")
                .nickname("남")
                .gender(Gender.F)
                .build();
        // comment owned by 'user', but caller is 'otherUser'
        CommentEntity comment = CommentEntity.builder()
                .user(user)
                .post(post)
                .content("원본 댓글")
                .build();
        given(userRepository.findByLoginId("other")).willReturn(Optional.of(otherUser));
        given(postRepository.findById(1L)).willReturn(Optional.of(post));
        given(commentRepository.findById(1L)).willReturn(Optional.of(comment));

        assertThatThrownBy(() -> communityService.commentEdit(dto, 1L, 1L, "other"))
                .isInstanceOf(CustomException.class)
                .satisfies(ex -> assertThat(((CustomException) ex).getErrorCode()).isEqualTo(ErrorCode.UNAUTHORIZED_USER));
    }

    @Test
    void commentEdit_throwsCommentNotFound_whenCommentDoesNotExist() {
        CommentEditRequestDto dto = new CommentEditRequestDto("수정된 댓글");
        given(userRepository.findByLoginId("testuser")).willReturn(Optional.of(user));
        given(postRepository.findById(1L)).willReturn(Optional.of(post));
        given(commentRepository.findById(99L)).willReturn(Optional.empty());

        assertThatThrownBy(() -> communityService.commentEdit(dto, 1L, 99L, "testuser"))
                .isInstanceOf(CustomException.class)
                .satisfies(ex -> assertThat(((CustomException) ex).getErrorCode()).isEqualTo(ErrorCode.COMMENT_NOT_FOUND));
    }

    // ─── listComment ─────────────────────────────────────────────────────────

    @Test
    void listComment_returnsPagedComments_whenUserExists() {
        Pageable pageable = PageRequest.of(0, 10);
        given(userRepository.findByLoginId("testuser")).willReturn(Optional.of(user));
        given(commentRepository.findByUser_LoginId("testuser", pageable)).willReturn(Page.empty());

        ListCommentPageResponseDto result = communityService.listComment("testuser", pageable);

        assertThat(result).isNotNull();
    }

    @Test
    void listComment_throwsUserNotFound_whenUserDoesNotExist() {
        Pageable pageable = PageRequest.of(0, 10);
        given(userRepository.findByLoginId("ghost")).willReturn(Optional.empty());

        assertThatThrownBy(() -> communityService.listComment("ghost", pageable))
                .isInstanceOf(CustomException.class)
                .satisfies(ex -> assertThat(((CustomException) ex).getErrorCode()).isEqualTo(ErrorCode.USER_NOT_FOUND));
    }

    // ─── myPostList ───────────────────────────────────────────────────────────

    @Test
    void myPostList_returnsPagedMyPosts_whenUserExists() {
        Pageable pageable = PageRequest.of(0, 10);
        given(userRepository.findByLoginId("testuser")).willReturn(Optional.of(user));
        given(postRepository.findByUser_LoginId("testuser", pageable)).willReturn(Page.empty());

        ListPostPageResponseDto result = communityService.myPostList("testuser", pageable);

        assertThat(result).isNotNull();
    }

    // ─── myBookmarkList ───────────────────────────────────────────────────────

    @Test
    void myBookmarkList_returnsPagedBookmarks_whenUserExists() {
        Pageable pageable = PageRequest.of(0, 10);
        given(userRepository.findByLoginId("testuser")).willReturn(Optional.of(user));
        given(bookmarkRepository.findByUser_UserId(user.getUserId(), pageable)).willReturn(Page.empty());

        BookmarkListPageResponseDto result = communityService.myBookmarkList("testuser", pageable);

        assertThat(result).isNotNull();
    }
}
