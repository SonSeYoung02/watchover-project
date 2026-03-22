package com.chh.watchover.service;

import com.chh.watchover.dto.ApiResponse;
import com.chh.watchover.dto.community.CommentWriteResponseDto;
import com.chh.watchover.dto.community.CommentWriteRequestDto;
import com.chh.watchover.dto.community.PostWriteRequestDto;
import com.chh.watchover.dto.community.PostWriteResponseDto;
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
    public ApiResponse<PostWriteResponseDto> postWrite(PostWriteRequestDto postWriteRequestDto, String loginId) {
        UserEntity user = userRepository.findByLoginId(loginId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
        PostEntity post = PostEntity.of(postWriteRequestDto, user);
        PostEntity savePost = postRepository.save(post);
        PostWriteResponseDto postWriteResponseDto = PostWriteResponseDto.from(savePost);
        return ApiResponse.success(postWriteResponseDto);
    }

    /*
    ============================================================================
    2. 댓글 작성
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
    public ApiResponse<CommentWriteResponseDto> commentWrite(Long postId,CommentWriteRequestDto commentWriteRequestDto, String loginId) {
        UserEntity user = userRepository.findByLoginId(loginId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
        CommentEntity comment = CommentEntity.of(commentWriteRequestDto, user, postId);
        CommentEntity saveComment = commentRepository.save(comment);
        CommentWriteResponseDto commentWriteResponseDto = CommentWriteResponseDto.of(saveComment, user);
        return ApiResponse.success(commentWriteResponseDto);
    }

}
