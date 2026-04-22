package com.chh.watchover.global.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    /**
     * Watchover API의 OpenAPI 스펙을 구성합니다.
     * <p>
     * JWT Bearer 인증 스킴을 전역으로 적용하며, Swagger UI에서 인증 헤더를 설정할 수 있도록 합니다.
     *
     * @return JWT 인증이 포함된 {@link OpenAPI} 인스턴스
     */
    @Bean
    public OpenAPI openAPI() {
        String jwtScheme = "bearerAuth";

        return new OpenAPI()
                .info(new Info()
                        .title("Watchover API")
                        .description("Watchover 프로젝트 REST API 문서")
                        .version("v1.0.0"))
                .addSecurityItem(new SecurityRequirement().addList(jwtScheme))
                .components(new Components()
                        .addSecuritySchemes(jwtScheme, new SecurityScheme()
                                .name(jwtScheme)
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")));
    }
}