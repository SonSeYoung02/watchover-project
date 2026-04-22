package com.chh.watchover.global.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final JwtTokenProvider jwtTokenProvider;

    /**
     * HTTP 요청마다 한 번 실행되며, Authorization 헤더에서 Bearer 토큰을 추출하여
     * JWT 유효성을 검증한 후 인증 정보를 SecurityContext에 등록한다.
     *
     * @param request     클라이언트의 HTTP 요청 객체
     * @param response    서버의 HTTP 응답 객체
     * @param filterChain 다음 필터로 요청을 전달하는 필터 체인
     * @throws ServletException 서블릿 처리 중 오류가 발생한 경우
     * @throws IOException      입출력 처리 중 오류가 발생한 경우
     */
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        // 1. 헤더에서 토큰 꺼내기
        String bearerToken = request.getHeader("Authorization");

        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            String token = bearerToken.substring(7);

            // 2. 토큰이 진짜면
            if (jwtTokenProvider.validateToken(token)) {
                String loginId = jwtTokenProvider.getLoginId(token);

                // 3. 인증된 사용자"라고 스프링에게 알려주기
                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(loginId, null, List.of(new SimpleGrantedAuthority("USER")));
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        }

        filterChain.doFilter(request, response); // 다음 단계로 이동
    }
}
