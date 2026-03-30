package com.chh.watchover.config;

import com.chh.watchover.dto.ApiResponse;
import com.chh.watchover.util.JwtAuthenticationFilter;
import com.chh.watchover.util.JwtTokenProvider;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.CsrfConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import tools.jackson.databind.ObjectMapper;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtTokenProvider jwtTokenProvider;

    // 1. 암호화
    @Bean
    public PasswordEncoder passwordEncoder() {    // 복호화 관련 메소드
        return new BCryptPasswordEncoder();
    }

    // 2. 보안 설정
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(CsrfConfigurer<HttpSecurity>::disable)
                .sessionManagement(sessionManagement ->
                        sessionManagement.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests((authorize) -> authorize
                        .requestMatchers("/api/user/login").permitAll()
                        .requestMatchers("/api/user/register").permitAll()
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
}
