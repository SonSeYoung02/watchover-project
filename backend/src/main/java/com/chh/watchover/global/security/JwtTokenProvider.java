package com.chh.watchover.global.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtTokenProvider {
    private final Key key;
    private static final long expireTime = 1000L * 60 * 60; // 1시간

    public JwtTokenProvider(@Value("${spring.jwt.secret}") String secretKey) {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        this.key = Keys.hmacShaKeyFor(keyBytes);
    }

    /**
     * 로그인 ID를 기반으로 서명된 JWT 액세스 토큰을 생성한다.
     * 토큰의 유효 기간은 1시간이며, HMAC-SHA 알고리즘으로 서명된다.
     *
     * @param loginId 토큰의 subject(주체)로 포함될 사용자 로그인 ID
     * @return 서명된 JWT 토큰 문자열
     */
    public String createToken(String loginId) {
        Date now = new Date();
        Date validity = new Date(now.getTime() + expireTime);

        return Jwts.builder()
                .subject(loginId)
                .issuedAt(now)
                .expiration(validity)
                .signWith(key)
                .compact();
    }

    /**
     * JWT 토큰의 Claims에서 사용자 로그인 ID(subject)를 추출하여 반환한다.
     *
     * @param token 파싱할 JWT 토큰 문자열
     * @return 토큰의 subject 필드에 저장된 사용자 로그인 ID
     */
    public String getLoginId(String token) {
        return Jwts.parser()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    /**
     * JWT 토큰의 서명과 만료 여부를 검증하여 유효성을 반환한다.
     * 파싱 중 예외가 발생하면 토큰이 유효하지 않은 것으로 간주한다.
     *
     * @param token 유효성을 검사할 JWT 토큰 문자열
     * @return 토큰이 유효하면 {@code true}, 그렇지 않으면 {@code false}
     */
    public boolean validateToken(String token) {
        try {
            Jwts.parser().setSigningKey(key)
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

}
