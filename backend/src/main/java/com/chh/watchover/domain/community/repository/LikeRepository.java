package com.chh.watchover.domain.community.repository;

import com.chh.watchover.domain.community.model.entity.LikeEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface LikeRepository extends JpaRepository<LikeEntity, Long> {
    Optional<LikeEntity> findByUser_UserIdAndPost_PostId(Long userId, Long postId);

    void deleteByPost_PostId(Long postId);
}
