package com.chh.watchover.service;

import com.chh.watchover.dto.UserRequestDto;
import com.chh.watchover.dto.UserResponseDto;
import com.chh.watchover.entity.UserEntity;
import com.chh.watchover.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class LoginService {

    private final UserRepository userRepository;

    @Autowired
    public LoginService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    // 1. 유저 생성
    public Long userRegister(UserRequestDto userRequestDto) {
        UserEntity userEntity = UserEntity.builder()
                .loginId(userRequestDto.getLoginId())
                .loginPw(userRequestDto.getLoginPw())
                .email(userRequestDto.getEmail())
                .nickname(userRequestDto.getNickname())
                .gender(userRequestDto.getGender())
                .build();
        UserEntity savedUser = userRepository.save(userEntity);
        return savedUser.getUserId();
    }

    // 2. 유저 조회
    public UserResponseDto userSearch(Long userId) {
        UserEntity userEntity = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
        return UserResponseDto.builder()
                .loginId(userEntity.getLoginId())
                .email(userEntity.getEmail())
                .nickname(userEntity.getNickname())
                .total_login(userEntity.getTotalLogin())
                .lastLoginAt(userEntity.getLastLoginAt())
                .point(userEntity.getPoint())
                .build();
    }
}
