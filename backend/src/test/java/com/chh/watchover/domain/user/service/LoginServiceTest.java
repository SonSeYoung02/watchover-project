package com.chh.watchover.domain.user.service;

import com.chh.watchover.domain.character.repository.CharacterProfileRepository;
import com.chh.watchover.domain.user.model.dto.*;
import com.chh.watchover.domain.user.model.entity.UserEntity;
import com.chh.watchover.domain.user.model.type.Gender;
import com.chh.watchover.domain.user.repository.UserRepository;
import com.chh.watchover.global.exception.CustomException;
import com.chh.watchover.global.exception.code.ErrorCode;
import com.chh.watchover.global.security.JwtTokenProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class LoginServiceTest {

    @Mock private UserRepository userRepository;
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private JwtTokenProvider jwtTokenProvider;
    @Mock private CharacterProfileRepository characterProfileRepository;

    @InjectMocks
    private LoginService loginService;

    private UserEntity existingUser;

    @BeforeEach
    void setUp() {
        existingUser = UserEntity.builder()
                .loginId("user123")
                .loginPw("$2a$encoded")
                .email("user@example.com")
                .nickname("테스터")
                .gender(Gender.M)
                .build();
    }

    // ─── userRegister ─────────────────────────────────────────────────────────

    @Test
    void userRegister_savesUserAndReturnsDto_whenLoginIdAndEmailAreUnique() {
        RegisterRequestDto dto = new RegisterRequestDto("newuser", "Pass1234!", "new@example.com", "새닉", Gender.M);
        given(userRepository.existsByLoginId("newuser")).willReturn(false);
        given(userRepository.existsByEmail("new@example.com")).willReturn(false);
        given(passwordEncoder.encode("Pass1234!")).willReturn("$2a$encoded");
        given(userRepository.save(any(UserEntity.class))).willReturn(existingUser);

        RegisterResponseDto result = loginService.userRegister(dto);

        assertThat(result).isNotNull();
        verify(userRepository).save(any(UserEntity.class));
    }

    @Test
    void userRegister_throwsDuplicateId_whenLoginIdAlreadyExists() {
        RegisterRequestDto dto = new RegisterRequestDto("user123", "Pass1234!", "new@example.com", "새닉", Gender.M);
        given(userRepository.existsByLoginId("user123")).willReturn(true);

        assertThatThrownBy(() -> loginService.userRegister(dto))
                .isInstanceOf(CustomException.class)
                .satisfies(ex -> assertThat(((CustomException) ex).getErrorCode()).isEqualTo(ErrorCode.DUPLICATE_ID));
    }

    @Test
    void userRegister_throwsDuplicateEmail_whenEmailAlreadyExists() {
        RegisterRequestDto dto = new RegisterRequestDto("newuser", "Pass1234!", "user@example.com", "새닉", Gender.M);
        given(userRepository.existsByLoginId("newuser")).willReturn(false);
        given(userRepository.existsByEmail("user@example.com")).willReturn(true);

        assertThatThrownBy(() -> loginService.userRegister(dto))
                .isInstanceOf(CustomException.class)
                .satisfies(ex -> assertThat(((CustomException) ex).getErrorCode()).isEqualTo(ErrorCode.DUPLICATE_EMAIL));
    }

    // ─── userLogin ────────────────────────────────────────────────────────────

    @Test
    void userLogin_returnsJwtToken_whenCredentialsAreValid() {
        LoginRequestDto dto = new LoginRequestDto("user123", "Pass1234!");
        given(userRepository.findByLoginId("user123")).willReturn(Optional.of(existingUser));
        given(passwordEncoder.matches("Pass1234!", "$2a$encoded")).willReturn(true);
        given(jwtTokenProvider.createToken("user123")).willReturn("jwt.token.here");

        LoginResponseDto result = loginService.userLogin(dto);

        assertThat(result).isNotNull();
    }

    @Test
    void userLogin_throwsUserNotFound_whenLoginIdDoesNotExist() {
        LoginRequestDto dto = new LoginRequestDto("ghost", "Pass1234!");
        given(userRepository.findByLoginId("ghost")).willReturn(Optional.empty());

        assertThatThrownBy(() -> loginService.userLogin(dto))
                .isInstanceOf(CustomException.class)
                .satisfies(ex -> assertThat(((CustomException) ex).getErrorCode()).isEqualTo(ErrorCode.USER_NOT_FOUND));
    }

    @Test
    void userLogin_throwsLoginFailed_whenPasswordDoesNotMatch() {
        LoginRequestDto dto = new LoginRequestDto("user123", "WrongPass!");
        given(userRepository.findByLoginId("user123")).willReturn(Optional.of(existingUser));
        given(passwordEncoder.matches("WrongPass!", "$2a$encoded")).willReturn(false);

        assertThatThrownBy(() -> loginService.userLogin(dto))
                .isInstanceOf(CustomException.class)
                .satisfies(ex -> assertThat(((CustomException) ex).getErrorCode()).isEqualTo(ErrorCode.LOGIN_FAILED));
    }

    // ─── userUpdate ───────────────────────────────────────────────────────────

    @Test
    void userUpdate_updatesUserFields_whenUserExists() {
        UserUpdateRequestDto dto = new UserUpdateRequestDto("NewPass1!", "new@example.com", "새닉네임", Gender.F);
        given(userRepository.findByLoginId("user123")).willReturn(Optional.of(existingUser));
        given(passwordEncoder.encode("NewPass1!")).willReturn("$2a$newEncoded");

        UserUpdateResponseDto result = loginService.userUpdate(dto, "user123");

        assertThat(result).isNotNull();
    }

    @Test
    void userUpdate_throwsUserNotFound_whenUserDoesNotExist() {
        UserUpdateRequestDto dto = new UserUpdateRequestDto("NewPass1!", "new@example.com", "새닉네임", Gender.F);
        given(userRepository.findByLoginId("ghost")).willReturn(Optional.empty());

        assertThatThrownBy(() -> loginService.userUpdate(dto, "ghost"))
                .isInstanceOf(CustomException.class)
                .satisfies(ex -> assertThat(((CustomException) ex).getErrorCode()).isEqualTo(ErrorCode.USER_NOT_FOUND));
    }

    // ─── userDelete ───────────────────────────────────────────────────────────

    @Test
    void userDelete_deletesUserAndReturnsDto_whenUserExists() {
        given(userRepository.findByLoginId("user123")).willReturn(Optional.of(existingUser));

        UserDeleteResponseDto result = loginService.userDelete("user123");

        assertThat(result).isNotNull();
        verify(userRepository).delete(existingUser);
    }

    @Test
    void userDelete_throwsUserNotFound_whenUserDoesNotExist() {
        given(userRepository.findByLoginId("ghost")).willReturn(Optional.empty());

        assertThatThrownBy(() -> loginService.userDelete("ghost"))
                .isInstanceOf(CustomException.class)
                .satisfies(ex -> assertThat(((CustomException) ex).getErrorCode()).isEqualTo(ErrorCode.USER_NOT_FOUND));
    }

    // ─── userSearch ───────────────────────────────────────────────────────────

    @Test
    void userSearch_returnsUserDto_whenUserExistsWithCharacterProfile() {
        given(userRepository.findByLoginId("user123")).willReturn(Optional.of(existingUser));
        given(characterProfileRepository.findByUserUserId(existingUser.getUserId()))
                .willReturn(Optional.empty());

        SearchResponseDto result = loginService.userSearch("user123");

        assertThat(result).isNotNull();
    }

    @Test
    void userSearch_throwsUserNotFound_whenUserDoesNotExist() {
        given(userRepository.findByLoginId("ghost")).willReturn(Optional.empty());

        assertThatThrownBy(() -> loginService.userSearch("ghost"))
                .isInstanceOf(CustomException.class)
                .satisfies(ex -> assertThat(((CustomException) ex).getErrorCode()).isEqualTo(ErrorCode.USER_NOT_FOUND));
    }
}
