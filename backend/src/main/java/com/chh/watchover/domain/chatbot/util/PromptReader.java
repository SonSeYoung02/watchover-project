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

    public String readPrompt(String fileName) {
        try {
            Resource resource = resourceLoader.getResource("classpath:prompts/care-prompt");
            return StreamUtils.copyToString(resource.getInputStream(), StandardCharsets.UTF_8);
        } catch (IOException e) {
            throw new RuntimeException("프롬프트 파일을 읽을 수 없습니다: " + fileName);
        }
    }
}