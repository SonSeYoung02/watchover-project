package com.chh.watchover.service;

import com.chh.watchover.dto.ApiResponse;
import com.chh.watchover.dto.user.*;
import com.chh.watchover.entity.UserEntity;
import com.chh.watchover.exception.CustomException;
import com.chh.watchover.exception.ErrorCode;
import com.chh.watchover.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class LoginService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private LocalDateTime lastLoginAt;

    @Autowired
    public LoginService(UserRepository userRepository, BCryptPasswordEncoder passwordEncoder, JwtTokenProvider jwtTokenProvider) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
    }
    /*
    ============================================================================
    1. 유저 생성
    - 존재하는 아이디가 있으면 오류 반환
    - 존재하는 이메일이 있으면 오류 반환
    - 위의 조건 충족시 DB에 저장
    - 회원가입 응답 생성
    - 응답 포멧에 맞춰 반환
    ============================================================================
     */
    public ApiResponse<RegisterResponseDto> userRegister(RegisterRequestDto registerRequestDto) {

        // 1.1 아이디가 중복이면 예외처리
        if (userRepository.existsByLoginId(registerRequestDto.getLoginId())) {
            throw new CustomException(ErrorCode.DUPLICATE_ID);
        }

        // 1.2 이메일이 존재하면 예외처리
        if (userRepository.existsByEmail(registerRequestDto.getEmail())) {
            throw new CustomException(ErrorCode.DUPLICATE_EMAIL);
        }

        // 1.3 비밀번호 암호화해서 DB에 저장
        String encodedPassword = passwordEncoder.encode(registerRequestDto.getLoginPw());
        UserEntity user = UserEntity.builder()
                .loginId(registerRequestDto.getLoginId())
                .loginPw(encodedPassword)
                .email(registerRequestDto.getEmail())
                .nickname(registerRequestDto.getNickname())
                .gender(registerRequestDto.getGender())
                .build();

        // 1.4 DB에 저장
        UserEntity saveUser = userRepository.save(user);

        // 1.5 회원가입 응답 DTO 생성
        RegisterResponseDto registerResponseDto = RegisterResponseDto.from(saveUser);

        // 1.6 응답 포멧에 맞춰 반환
        return ApiResponse.success(registerResponseDto);
    }

    /*
    ============================================================================
    2. 유저 조회
    ============================================================================
     */
    public ApiResponse<SearchResponseDto> userSearch(Long userId) {
        Optional<UserEntity> result = userRepository.findById(userId);
        final UserEntity user;

        // 2.1 저장소에 찾는 사용자가 없을때 예외처리
        if (result.isPresent()) {
            user = result.get();
        } else {
            throw new CustomException(ErrorCode.USER_NOT_FOUND);
        }

        // 2.2 응답 포멧에 맞춰 반환
        SearchResponseDto searchResponseDto = SearchResponseDto.from(user);

        return ApiResponse.success(searchResponseDto);
    }

    /*
    ============================================================================
    3. 유저 로그인
    - 존재하는 아이디가 있으면 오류 반환
    - 존재하는 이메일이 있으면 오류 반환
    - 위의 조건 충족시 DB에 저장
    - 회원가입 응답 생성
    - 응답 포멧에 맞춰 반환
    ============================================================================
     */
    public ApiResponse<LoginResponseDto> userLogin(LoginRequestDto loginRequestDto) {
        final String loginId = loginRequestDto.getLoginId();
        final String loginPw = loginRequestDto.getLoginPw();

        final UserEntity user = userRepository.findByLoginId(loginId);

        // 3.1 로그인 비밀번호 일치 확인 로직
        // 아이디가 틀렸거나 비밀번호가 틀렸으면 예외 발생
        if (!user.getLoginId().equals(loginId) || !user.getLoginPw().equals(loginPw)) {
            throw new CustomException(ErrorCode.LOGIN_FAILED);
        }

        // 3.2 유저의 로그인 시간을 업데이트
        user.updateLoginTime();
        userRepository.save(user);

        // 3.4 토큰 생성
        String token = jwtTokenProvider.createToken(loginId);

        // 3.3 로그인 Dto 생성
        LoginResponseDto loginResponseDto = LoginResponseDto.from(token);

        // 3.2 일치하면 성공 반송
        return ApiResponse.success(loginResponseDto);
    }
}
