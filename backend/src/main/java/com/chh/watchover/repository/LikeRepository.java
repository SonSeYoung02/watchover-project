package com.chh.watchover.repository;

import com.chh.watchover.entity.LikeEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface LikeRepository extends JpaRepository<LikeEntity, Long> {
    Optional<LikeEntity> findByUser_UserIdAndPost_PostId(Long userId, Long postId);
}
