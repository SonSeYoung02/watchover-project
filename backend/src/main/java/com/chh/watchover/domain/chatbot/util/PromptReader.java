package com.chh.watchover.domain.chatbot.util;

import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Component;
import org.springframework.util.StreamUtils;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

@Component
public class PromptReader {
    private final ResourceLoader resourceLoader;

    public PromptReader(ResourceLoader resourceLoader) {
        this.resourceLoader = resourceLoader;
    }

    /**
     * 지정한 파일 이름에 해당하는 프롬프트 파일을 classpath에서 읽어 문자열로 반환합니다.
     *
     * @param fileName 읽을 프롬프트 파일 이름 (확장자 .md 제외)
     * @return 프롬프트 파일의 전체 내용 문자열
     * @throws RuntimeException 파일을 읽을 수 없는 경우
     */
    public String readPrompt(String fileName) {
        try {
            Resource resource = resourceLoader.getResource("classpath:prompts/" + fileName + ".md");
            return StreamUtils.copyToString(resource.getInputStream(), StandardCharsets.UTF_8);
        } catch (IOException e) {
            throw new RuntimeException("프롬프트 파일을 읽을 수 없습니다: " + fileName);
        }
    }
}