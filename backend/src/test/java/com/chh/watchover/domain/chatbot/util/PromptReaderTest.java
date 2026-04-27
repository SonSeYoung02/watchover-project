package com.chh.watchover.domain.chatbot.util;

import org.junit.jupiter.api.Test;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.ResourceLoader;

import java.nio.charset.StandardCharsets;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;

class PromptReaderTest {

    @Test
    void readPrompt_stripsTxtExtensionAndResolvesDoctorAlias() {
        ResourceLoader resourceLoader = mock(ResourceLoader.class);
        given(resourceLoader.getResource("classpath:prompts/care-prompt.md"))
                .willReturn(new ByteArrayResource("care prompt".getBytes(StandardCharsets.UTF_8)));
        PromptReader promptReader = new PromptReader(resourceLoader);

        String result = promptReader.readPrompt("doctor.txt");

        assertThat(result).isEqualTo("care prompt");
        verify(resourceLoader).getResource("classpath:prompts/care-prompt.md");
    }

    @Test
    void readPrompt_usesDefaultPromptWhenFileNameIsBlank() {
        ResourceLoader resourceLoader = mock(ResourceLoader.class);
        given(resourceLoader.getResource("classpath:prompts/care-prompt.md"))
                .willReturn(new ByteArrayResource("default prompt".getBytes(StandardCharsets.UTF_8)));
        PromptReader promptReader = new PromptReader(resourceLoader);

        String result = promptReader.readPrompt(" ");

        assertThat(result).isEqualTo("default prompt");
        verify(resourceLoader).getResource("classpath:prompts/care-prompt.md");
    }
}
