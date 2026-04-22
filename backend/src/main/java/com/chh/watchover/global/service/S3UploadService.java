package com.chh.watchover.global.service;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.InputStream;

@Slf4j
@Service
@RequiredArgsConstructor
public class S3UploadService {

    private final AmazonS3 amazonS3;

    @Value("${S3_BUCKET_NAME}")
    private String bucket;

    /**
     * 이미지 바이트 배열을 지정된 파일명으로 S3 버킷에 업로드합니다.
     *
     * @param imageBytes 업로드할 이미지 데이터 (PNG 형식)
     * @param fileName   S3에 저장될 파일 경로 및 이름 (예: "characters/uuid.png")
     * @return S3에 업로드된 파일의 접근 URL
     * @throws RuntimeException S3 업로드 중 오류가 발생한 경우
     */
    public String upload(byte[] imageBytes, String fileName) {
        ObjectMetadata metadata = new ObjectMetadata();
        metadata.setContentLength(imageBytes.length);
        metadata.setContentType("image/png");

        try (InputStream inputStream = new ByteArrayInputStream(imageBytes)) {
            // [수정] .withCannedAcl 설정을 제거하여 ACL 비활성화 버킷 에러 해결
            amazonS3.putObject(new PutObjectRequest(bucket, fileName, inputStream, metadata));

            log.info("S3 파일 업로드 성공: {}", fileName);
        } catch (Exception e) {
            log.error("S3 업로드 중 에러 발생: {}", e.getMessage());
            throw new RuntimeException("S3 업로드 실패", e);
        }

        return amazonS3.getUrl(bucket, fileName).toString();
    }
}