package com.chh.watchover.domain.chatbot.util;

import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Component;
import org.springframework.util.StreamUtils;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Map;

@Component
public class PromptReader {
    private static final String DEFAULT_PROMPT = "care-prompt";
    private static final Map<String, String> PROMPT_ALIASES = Map.of(
            "doctor", DEFAULT_PROMPT
    );

    private final ResourceLoader resourceLoader;

    public PromptReader(ResourceLoader resourceLoader) {
        this.resourceLoader = resourceLoader;
    }

    public String readPrompt(String fileName) {
        String promptName = normalizePromptName(fileName);

        try {
            Resource resource = resourceLoader.getResource("classpath:prompts/" + promptName + ".md");
            return StreamUtils.copyToString(resource.getInputStream(), StandardCharsets.UTF_8);
        } catch (IOException e) {
            throw new RuntimeException("프롬프트 파일을 읽을 수 없습니다: " + fileName, e);
        }
    }

    private String normalizePromptName(String fileName) {
        if (fileName == null || fileName.isBlank()) {
            return DEFAULT_PROMPT;
        }

        String promptName = fileName.trim();
        if (promptName.endsWith(".md") || promptName.endsWith(".txt")) {
            promptName = promptName.substring(0, promptName.lastIndexOf('.'));
        }

        return PROMPT_ALIASES.getOrDefault(promptName, promptName);
    }
}
