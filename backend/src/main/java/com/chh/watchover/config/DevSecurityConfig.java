package com.chh.watchover.config;

import com.chh.watchover.config.security.JwtAuthenticationFilter;
import com.chh.watchover.service.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
@Profile("dev")
public class DevSecurityConfig {

    private final JwtTokenProvider jwtTokenProvider;

    /*
    ======================================================================================
    [개발자용 설정]
    - 모든 api 보안설정 없이 접근 가능
    - 개발 완료 후 ProdSecurityConfig로 교체 바람
    ======================================================================================
     */

    // 1. 암호화
    @Bean
    public BCryptPasswordEncoder passwordEncoder() {    // 복호화 관련 메소드
        return new BCryptPasswordEncoder();
    }

    // 2. 보안설정
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        .anyRequest().permitAll()
                )
                .addFilterBefore(new JwtAuthenticationFilter(jwtTokenProvider), UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }
}
