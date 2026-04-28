package com.chh.watchover.domain.user.service;

import com.chh.watchover.domain.character.repository.CharacterProfileRepository;
import com.chh.watchover.domain.user.model.dto.*;
import com.chh.watchover.global.security.JwtTokenProvider;
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
    private final CharacterProfileRepository characterProfileRepository;

    @Autowired
    public LoginService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtTokenProvider jwtTokenProvider, CharacterProfileRepository characterProfileRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
        this.characterProfileRepository = characterProfileRepository;
    }

    /**
     * 신규 유저를 등록합니다.
     * loginId·email 중복 시 예외를 발생시키고, 비밀번호는 암호화하여 저장합니다.
     *
     * @param registerRequestDto 회원가입 요청 DTO
     * @return 생성된 유저 정보 DTO
     * @throws CustomException DUPLICATE_ID / DUPLICATE_EMAIL
     */
    public RegisterResponseDto userRegister(RegisterRequestDto registerRequestDto) {
        if (userRepository.existsByLoginId(registerRequestDto.loginId())) { throw new CustomException(ErrorCode.DUPLICATE_ID); }
        if (userRepository.existsByEmail(registerRequestDto.email())) { throw new CustomException(ErrorCode.DUPLICATE_EMAIL); }
        String encodedPassword = passwordEncoder.encode(registerRequestDto.loginPw());
        UserEntity user = UserEntity.of(registerRequestDto, encodedPassword);
        UserEntity saveUser = userRepository.save(user);
        return RegisterResponseDto.from(saveUser);
    }

    /**
     * userId(String)로 유저 정보를 조회합니다.
     *
     * @param userId 조회할 유저의 String 아이디
     * @return 유저 정보 DTO
     * @throws CustomException USER_NOT_FOUND
     */
    public SearchResponseDto userSearch(String userId) {
        UserEntity user = userRepository.findByLoginId(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
        String characterImage = characterProfileRepository.findFirstByUserUserIdOrderByIdDesc(user.getUserId())
                .map(c -> c.getImage())
                .orElse(null);
        return SearchResponseDto.from(user, characterImage);
    }

    /**
     * loginId·loginPw를 검증하고 JWT 토큰을 발급합니다.
     *
     * @param loginRequestDto 로그인 요청 DTO
     * @return JWT 토큰을 담은 DTO
     * @throws CustomException USER_NOT_FOUND / LOGIN_FAILED
     */
    public LoginResponseDto userLogin(LoginRequestDto loginRequestDto) {
        UserEntity user = userRepository.findByLoginId(loginRequestDto.loginId())
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
        if (!user.getLoginId().equals(loginRequestDto.loginId()) || !passwordEncoder.matches(loginRequestDto.loginPw(), user.getLoginPw())) { throw new CustomException(ErrorCode.LOGIN_FAILED); }
        String token = jwtTokenProvider.createToken(user.getLoginId());
        return LoginResponseDto.from(token);
    }

    /**
     * 현재 로그인된 유저의 계정을 삭제합니다.
     *
     * @param loginId 삭제할 유저의 loginId
     * @return 삭제된 유저 정보 DTO
     * @throws CustomException USER_NOT_FOUND
     */
    public UserDeleteResponseDto userDelete(String loginId) {
        UserEntity user = userRepository.findByLoginId(loginId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
        UserDeleteResponseDto userDeleteResponseDto = UserDeleteResponseDto.from(user);
        userRepository.delete(user);
        return userDeleteResponseDto;
    }

    /**
     * 현재 로그인된 유저의 정보(비밀번호 등)를 수정합니다.
     * 비밀번호는 암호화하여 저장합니다.
     *
     * @param dto     수정할 유저 정보 DTO
     * @param loginId 수정 대상 유저의 loginId
     * @return 수정된 유저 정보 DTO
     * @throws CustomException USER_NOT_FOUND
     */
    public UserUpdateResponseDto userUpdate(UserUpdateRequestDto dto, String loginId) {
        UserEntity user = userRepository.findByLoginId(loginId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
        String encodedPw = passwordEncoder.encode(dto.loginPw());
        UserEntity updateUser = user.userUpdate(dto, encodedPw);
        return UserUpdateResponseDto.from(updateUser);
    }
}
