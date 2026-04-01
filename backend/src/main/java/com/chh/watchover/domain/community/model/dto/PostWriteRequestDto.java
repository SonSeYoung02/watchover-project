package com.chh.watchover.domain.community.model.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;

@Getter
public class PostWriteRequestDto {

    @NotBlank(message = "제목이 비었습니다.")
    @Size(max = 100, message = "제목은 100자 이하로 입력해주세요.")
    private String title;

    @NotBlank(message = "본문이 비었습니다.")
    private String content;

}
