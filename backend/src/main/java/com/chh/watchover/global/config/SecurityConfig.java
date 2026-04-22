package com.chh.watchover.global.config;

import com.chh.watchover.global.common.ApiResponse;
import com.chh.watchover.global.security.JwtAuthenticationFilter;
import com.chh.watchover.global.security.JwtTokenProvider;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.CsrfConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import tools.jackson.databind.ObjectMapper;

import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtTokenProvider jwtTokenProvider;

    /**
     * 비밀번호를 BCrypt 알고리즘으로 단방향 암호화하는 {@link PasswordEncoder} 빈을 등록한다.
     * 회원가입 및 로그인 시 사용자 비밀번호의 안전한 저장과 검증에 사용된다.
     *
     * @return BCryptPasswordEncoder 인스턴스
     */
    // 1. 암호화
    @Bean
    public PasswordEncoder passwordEncoder() {    // 복호화 관련 메소드
        return new BCryptPasswordEncoder();
    }

    /**
     * Spring Security의 HTTP 보안 정책을 설정하는 {@link SecurityFilterChain} 빈을 등록한다.
     * CSRF 비활성화, 세션리스(STATELESS) 정책, 엔드포인트별 인가 규칙, 로그아웃 처리,
     * JWT 인증 필터 등록을 포함한다.
     *
     * @param http Spring Security HTTP 보안 설정 객체
     * @return 구성이 완료된 {@link SecurityFilterChain} 인스턴스
     * @throws Exception 보안 설정 구성 중 오류가 발생한 경우
     */
    // 2. 보안 설정
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(CsrfConfigurer<HttpSecurity>::disable)
                .sessionManagement(sessionManagement ->
                        sessionManagement.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests((authorize) -> authorize
                        .requestMatchers("/api/user/login").permitAll()
                        .requestMatchers("/api/user/register").permitAll()
                        .requestMatchers("/swagger-ui/**", "/v3/api-docs/**", "/swagger-ui.html").permitAll()
                        .anyRequest().authenticated()
                )
                .logout( (logout) -> logout
                        .logoutUrl("/api/user/logout")
                        .addLogoutHandler((request, response, authentication) -> {
                            SecurityContextHolder.clearContext();
                        })
                        .logoutSuccessHandler(((request, response, authentication) -> {
                            response.setStatus(HttpServletResponse.SC_ACCEPTED);
                            response.setContentType("application/json");
                            response.setCharacterEncoding("UTF-8");
                            ApiResponse<Void> apiResponse = ApiResponse.success(null);
                            String json = new ObjectMapper().writeValueAsString(apiResponse);
                            response.getWriter().write(json);
                        }))
                )
                .addFilterBefore(new JwtAuthenticationFilter(jwtTokenProvider), UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    /**
     * CORS(Cross-Origin Resource Sharing) 정책을 설정하는 {@link CorsConfigurationSource} 빈을 등록한다.
     * 허용된 출처, HTTP 메서드, 헤더, 자격증명(쿠키) 포함 여부를 정의하며
     * 모든 경로({@code /**})에 동일한 정책이 적용된다.
     *
     * @return URL 패턴별 CORS 설정이 등록된 {@link CorsConfigurationSource} 인스턴스
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:5173"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
