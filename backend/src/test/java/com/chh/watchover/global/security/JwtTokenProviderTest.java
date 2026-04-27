package com.chh.watchover.global.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Encoders;
import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.security.Key;
import java.util.Base64;
import java.util.Date;

import static org.assertj.core.api.Assertions.assertThat;

class JwtTokenProviderTest {

    // 256-bit key, Base64-encoded — satisfies JJWT's minimum key length requirement
    private static final String SECRET =
            Base64.getEncoder().encodeToString(
                    "watchover-test-secret-key-32chars!!".getBytes()
            );

    private JwtTokenProvider provider;

    @BeforeEach
    void setUp() {
        provider = new JwtTokenProvider(SECRET);
    }

    // --- createToken ---

    @Test
    void createToken_returnsNonNullToken_forGivenLoginId() {
        String token = provider.createToken("testuser");

        assertThat(token).isNotNull().isNotBlank();
    }

    @Test
    void createToken_embeds_loginId_asSubject_in_token() {
        String token = provider.createToken("alice");

        String subject = provider.getLoginId(token);

        assertThat(subject).isEqualTo("alice");
    }

    @Test
    void createToken_producesDifferentTokens_onSuccessiveCalls() throws InterruptedException {
        // iat (issuedAt) is second-precision; sleep ensures distinct timestamps
        Thread.sleep(1100);
        String token1 = provider.createToken("user");
        Thread.sleep(1100);
        String token2 = provider.createToken("user");

        assertThat(token1).isNotEqualTo(token2);
    }

    // --- validateToken ---

    @Test
    void validateToken_returnsTrue_forFreshlyCreatedToken() {
        String token = provider.createToken("user1");

        assertThat(provider.validateToken(token)).isTrue();
    }

    @Test
    void validateToken_returnsFalse_forMalformedToken() {
        assertThat(provider.validateToken("this.is.not.a.jwt")).isFalse();
    }

    @Test
    void validateToken_returnsFalse_forTokenSignedWithDifferentKey() {
        // Build a token using a completely different key
        byte[] otherKeyBytes = "another-different-secret-key-xyz!!".getBytes();
        Key otherKey = Keys.hmacShaKeyFor(otherKeyBytes);
        String alienToken = Jwts.builder()
                .subject("hacker")
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + 60_000))
                .signWith(otherKey)
                .compact();

        assertThat(provider.validateToken(alienToken)).isFalse();
    }

    @Test
    void validateToken_returnsFalse_forExpiredToken() {
        // Build a token that expired 1 second ago using our own key
        byte[] keyBytes = io.jsonwebtoken.io.Decoders.BASE64.decode(SECRET);
        Key key = Keys.hmacShaKeyFor(keyBytes);
        String expiredToken = Jwts.builder()
                .subject("expired-user")
                .issuedAt(new Date(System.currentTimeMillis() - 2000))
                .expiration(new Date(System.currentTimeMillis() - 1000))
                .signWith(key)
                .compact();

        assertThat(provider.validateToken(expiredToken)).isFalse();
    }

    @Test
    void validateToken_returnsFalse_forEmptyString() {
        assertThat(provider.validateToken("")).isFalse();
    }

    // --- getLoginId ---

    @Test
    void getLoginId_returnsCorrectSubject_forValidToken() {
        String token = provider.createToken("bob");

        assertThat(provider.getLoginId(token)).isEqualTo("bob");
    }

    @Test
    void getLoginId_preservesSpecialCharacters_inLoginId() {
        String loginId = "user@example.com";
        String token = provider.createToken(loginId);

        assertThat(provider.getLoginId(token)).isEqualTo(loginId);
    }
}
