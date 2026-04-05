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

    @Value("${cloud.aws.s3.bucket}")
    private String bucket;

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