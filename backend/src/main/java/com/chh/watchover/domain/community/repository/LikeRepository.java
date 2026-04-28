package com.chh.watchover.domain.community.repository;

import com.chh.watchover.domain.community.model.entity.LikeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface LikeRepository extends JpaRepository<LikeEntity, Long> {
    Optional<LikeEntity> findByUser_UserIdAndPost_PostId(Long userId, Long postId);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("delete from LikeEntity l where l.post.postId = :postId")
    void deleteByPost_PostId(@Param("postId") Long postId);
}
