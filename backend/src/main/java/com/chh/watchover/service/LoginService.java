package com.chh.watchover.service;

import com.chh.watchover.util.JwtTokenProvider;
import com.chh.watchover.dto.ApiResponse;
import com.chh.watchover.dto.user.*;
import com.chh.watchover.entity.UserEntity;
import com.chh.watchover.exception.CustomException;
import com.chh.watchover.exception.ErrorCode;
import com.chh.watchover.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class LoginService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    @Autowired
    public LoginService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtTokenProvider jwtTokenProvider) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
    }
    /*
    ============================================================================
    1. 유저 생성
    - if(아이디가 중복이면 오류 반환)
    - if(이메일이 중복이면 오류 반환)
    - 비밀번호 암호화하기
    - UserEntity 생성하기 of(인자: RegisterRequestDto, encodedPassword)
    - userRepository(DB)에 저장
    - 회원가입 응답 DTO 생성
    - 응답 포멧에 맞춰 반환
    ============================================================================
     */
    public ApiResponse<RegisterResponseDto> userRegister(RegisterRequestDto registerRequestDto) {
        if (userRepository.existsByLoginId(registerRequestDto.getLoginId())) { throw new CustomException(ErrorCode.DUPLICATE_ID); }
        if (userRepository.existsByEmail(registerRequestDto.getEmail())) { throw new CustomException(ErrorCode.DUPLICATE_EMAIL); }
        String encodedPassword = passwordEncoder.encode(registerRequestDto.getLoginPw());
        UserEntity user = UserEntity.of(registerRequestDto, encodedPassword);
        UserEntity saveUser = userRepository.save(user);
        RegisterResponseDto registerResponseDto = RegisterResponseDto.from(saveUser);
        return ApiResponse.success(registerResponseDto);
    }

    /*
    ============================================================================
    2. 유저 조회
    - UserEntit를 찾아서 result에 저장
    - result 변수에 사용자가 null일때 오류 반환
    - SearchResponseDto 생성 from(인자: UserEntity)
    - 표준 응답 포멧에 따라 반환
    ============================================================================
     */
    public ApiResponse<SearchResponseDto> userSearch(Long userId) {
        Optional<UserEntity> result = userRepository.findById(userId);
        final UserEntity user;
        if (result.isPresent()) {
            user = result.get();
        } else {
            throw new CustomException(ErrorCode.USER_NOT_FOUND);
        }
        SearchResponseDto searchResponseDto = SearchResponseDto.from(user);
        return ApiResponse.success(searchResponseDto);
    }

    /*
    ============================================================================
    3. 유저 로그인
    - UserEntity가 null이 아닌지 확인 후 Optional을 열어 user에 저장
        - UserEntity가 비어있는 경우 ErrorCode 반환
    - 로그인과 비밀번호가 일치하는지 확인(비밀번호는 암호화 되어있기 때문에 SpringSecurity에게 맞는 비밀번호 인지 확인 받아야함)
    - 인증이 완료되면 토큰 생성
    - LoginResponseDto에 토큰을 넣고 생성
    - 표준 응답 포멧에 따라 반환
    ============================================================================
     */
    public ApiResponse<LoginResponseDto> userLogin(LoginRequestDto loginRequestDto) {
        final UserEntity user = userRepository.findByLoginId(loginRequestDto.getLoginId())
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
        if (!user.getLoginId().equals(loginRequestDto.getLoginId()) || !passwordEncoder.matches(loginRequestDto.getLoginPw(), user.getLoginPw())) { throw new CustomException(ErrorCode.LOGIN_FAILED); }
        String token = jwtTokenProvider.createToken(user.getLoginId());
        LoginResponseDto loginResponseDto = LoginResponseDto.from(token);
        return ApiResponse.success(loginResponseDto);
    }
}
