package com.chh.watchover.domain.user.service;

import com.chh.watchover.domain.user.model.dto.*;
import com.chh.watchover.global.security.JwtTokenProvider;
import com.chh.watchover.global.common.ApiResponse;
import com.chh.watchover.domain.user.model.entity.UserEntity;
import com.chh.watchover.global.exception.CustomException;
import com.chh.watchover.global.exception.code.ErrorCode;
import com.chh.watchover.domain.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

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
    /**
     * 신규 회원을 등록합니다. 아이디 및 이메일 중복 여부를 검증한 후 비밀번호를 암호화하여 사용자를 저장합니다.
     *
     * @param registerRequestDto 회원가입 요청 정보 (로그인 아이디, 비밀번호, 이메일 등)
     * @return 회원가입 완료된 사용자 정보를 담은 표준 응답
     * @throws CustomException 아이디 또는 이메일이 이미 존재하는 경우
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

    /**
     * 사용자 ID로 회원 정보를 조회합니다.
     *
     * @param userId 조회할 사용자의 고유 ID
     * @return 조회된 사용자 정보를 담은 표준 응답
     * @throws CustomException 해당 ID의 사용자가 존재하지 않는 경우
     */
    public ApiResponse<SearchResponseDto> userSearch(Long userId) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
        SearchResponseDto searchResponseDto = SearchResponseDto.from(user);
        return ApiResponse.success(searchResponseDto);
    }

    /**
     * 로그인 아이디와 비밀번호를 검증하여 JWT 토큰을 발급합니다.
     *
     * @param loginRequestDto 로그인 요청 정보 (로그인 아이디, 비밀번호)
     * @return 발급된 JWT 토큰을 담은 표준 응답
     * @throws CustomException 사용자가 존재하지 않거나 비밀번호가 일치하지 않는 경우
     */
    public ApiResponse<LoginResponseDto> userLogin(LoginRequestDto loginRequestDto) {
        UserEntity user = userRepository.findByLoginId(loginRequestDto.getLoginId())
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
        if (!user.getLoginId().equals(loginRequestDto.getLoginId()) || !passwordEncoder.matches(loginRequestDto.getLoginPw(), user.getLoginPw())) { throw new CustomException(ErrorCode.LOGIN_FAILED); }
        String token = jwtTokenProvider.createToken(user.getLoginId());
        LoginResponseDto loginResponseDto = LoginResponseDto.from(token);
        return ApiResponse.success(loginResponseDto);
    }

    /**
     * 로그인 아이디로 회원을 탈퇴 처리합니다.
     *
     * @param loginId 탈퇴할 사용자의 로그인 아이디
     * @return 탈퇴된 사용자 정보를 담은 표준 응답
     * @throws CustomException 해당 로그인 아이디의 사용자가 존재하지 않는 경우
     */
    public ApiResponse<UserDeleteResponseDto> userDelete(String loginId) {
        UserEntity user = userRepository.findByLoginId(loginId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
        UserDeleteResponseDto userDeleteResponseDto = UserDeleteResponseDto.from(user);
        userRepository.delete(user);
        return ApiResponse.success(userDeleteResponseDto);
    }

    /**
     * 로그인 아이디로 회원 정보를 수정합니다. 비밀번호는 새로 암호화하여 저장됩니다.
     *
     * @param dto     수정할 사용자 정보 (비밀번호 등)
     * @param loginId 수정 대상 사용자의 로그인 아이디
     * @return 수정된 사용자 정보를 담은 표준 응답
     * @throws CustomException 해당 로그인 아이디의 사용자가 존재하지 않는 경우
     */
    public ApiResponse<UserUpdateResponseDto> userUpdate(UserUpdateRequestDto dto, String loginId) {
        UserEntity user = userRepository.findByLoginId(loginId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
        String encodedPw = passwordEncoder.encode(dto.getLoginPw());
        UserEntity updateUser = user.userUpdate(dto, encodedPw);
        UserUpdateResponseDto userUpdateResponseDto = UserUpdateResponseDto.from(updateUser);
        return ApiResponse.success(userUpdateResponseDto);
    }
}
