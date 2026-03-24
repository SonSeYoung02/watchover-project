package com.chh.watchover.service;

import com.chh.watchover.dto.ApiResponse;
import com.chh.watchover.dto.community.*;
import com.chh.watchover.entity.CommentEntity;
import com.chh.watchover.entity.PostEntity;
import com.chh.watchover.entity.UserEntity;
import com.chh.watchover.exception.CustomException;
import com.chh.watchover.exception.ErrorCode;
import com.chh.watchover.repository.CommentRepository;
import com.chh.watchover.repository.PostRepository;
import com.chh.watchover.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CommunityService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final CommentRepository commentRepository;

    @Autowired
    public CommunityService(PostRepository postRepository, UserRepository userRepository, CommentRepository commentRepository) {
        this.postRepository = postRepository;
        this.userRepository = userRepository;
        this.commentRepository = commentRepository;
    }

    /*
    ============================================================================
    1. 게시물 작성
    - UserEntity가 null이 아닌지 확인 후 Optional을 열어 user에 저장
        - UserEntity가 비어있는 경우 ErrorCode 반환
    - 유저를 못찾는 경우 에러 반환
    - PostEntity 빌드
    - PostEntity 저장
    - PostWriteResponseDto 반환
    - 성공시 ApiResponse(표준 응답 포멧)으로 반환
    ============================================================================
    */
    public ApiResponse<PostWriteResponseDto> postWrite(PostWriteRequestDto dto, String loginId) {
        UserEntity user = userRepository.findByLoginId(loginId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
        PostEntity post = PostEntity.of(dto, user);
        PostEntity savePost = postRepository.save(post);
        String nickname = user.getNickname();
        PostWriteResponseDto postWriteResponseDto = PostWriteResponseDto.from(savePost, nickname);
        return ApiResponse.success(postWriteResponseDto);
    }

    /*
    ============================================================================
    2. 게시물 수정
    - UserEntity가 null이 아닌지 확인 후 Optional을 열어 user에 저장
        - UserEntity가 비어있는 경우 ErrorCode 반환
    - PostEntity가 null이 아닌지 확인 후 Optional을 열어 post에 저장
        - PostEntity가 비어있는 경우 ErrorCode 반환
    - 만약 loginId의 유저가 게시물 작성자가 아니면 에러 반환
    - 게시물 업데이트
    - 유저 닉네임 nickname변수에 저장
    - PostUpdateResponseDto 생성후 post와 nickname을 담아서 생성
    - 공동 응답 포멧으로 반환
    ============================================================================
    */
    @Transactional
    public ApiResponse<PostUpdateResponseDto> postUpdate(PostUpdateRequestDto dto,String loginId, Long postId) {
        UserEntity user = userRepository.findByLoginId(loginId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
        PostEntity post = postRepository.findById(postId)
                .orElseThrow(() -> new CustomException(ErrorCode.POST_NOT_FOUND));
        if (!post.getUser().getLoginId().equals(loginId)) {throw (new CustomException(ErrorCode.FORBIDDEN_ACCESS));}
        post.updatePost(dto.getTitle(),dto.getContent());
        String nickname = user.getNickname();
        PostUpdateResponseDto postUpdateResponseDto = PostUpdateResponseDto.of(post, nickname);
        return ApiResponse.success(postUpdateResponseDto);
    }


    /*
    ============================================================================
    3. 게시물 삭제
    - 게시물 ID를 찾아서 post 객체로 넘김
        - 만약 postId가 null 이면 오류 반환
    - 게시물 저장소에서 게시물 삭제
    - 성공 응답포멧 반환(반환값 null)
    ============================================================================
    */
    public ApiResponse<Void> postDelete(Long postId) {
        PostEntity post = postRepository.findById(postId)
                .orElseThrow(() -> new CustomException(ErrorCode.POST_NOT_FOUND));
        postRepository.delete(post);
        return ApiResponse.success(null);
    }

    /*
    ============================================================================
    4. 댓글 작성
    - UserEntity가 null이 아닌지 확인 후 Optional을 열어 user에 저장
        - UserEntity가 비어있는 경우 ErrorCode 반환
    - PostEntity가 null이 아닌지 확인 후 Optional을 열어 post에 저장
        - PostEntity가 비어있는 경우 ErrorCode 반환
    - CommentEntity 빌드(인자값: CommentWriteRequestDto, UserEntity)
    - CommentEntity 저장(인자값: CommentEntity)
    - CommentWriteRequestDto 반환(인자값: CommentEntity, UserEntity)
    - 성공시 ApiResponse(표준 응답 포멧)으로 반환
    ============================================================================
    */
    public ApiResponse<CommentWriteResponseDto> commentWrite(CommentWriteRequestDto dto, Long postId, String loginId) {
        UserEntity user = userRepository.findByLoginId(loginId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
        CommentEntity comment = CommentEntity.of(dto, user, postId);
        CommentEntity saveComment = commentRepository.save(comment);
        CommentWriteResponseDto commentWriteResponseDto = CommentWriteResponseDto.of(saveComment, user);
        return ApiResponse.success(commentWriteResponseDto);
    }

}
