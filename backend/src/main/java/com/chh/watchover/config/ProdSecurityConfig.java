package com.chh.watchover.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
@Profile("prod")
public class ProdSecurityConfig {

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {    // 복호화 관련 메소드
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .authorizeHttpRequests((authorize) -> authorize
                        .requestMatchers("").permitAll()
                        .anyRequest().permitAll()
                )
                .logout( (logout) -> logout
                        .logoutUrl("")
                        .logoutSuccessUrl("")
                        .permitAll()
                )
                .csrf( (csrf) -> csrf.disable() ); //로컬 환경에서 확인을 위해 disable;
        return http.build();
    }

}
