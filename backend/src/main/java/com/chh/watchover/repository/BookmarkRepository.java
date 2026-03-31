package com.chh.watchover.repository;

import com.chh.watchover.entity.BookmarkEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;


public interface BookmarkRepository extends JpaRepository<BookmarkEntity, Long> {
    Optional<BookmarkEntity> findByUser_userIdAndPost_postId(Long userId, Long postId);
}
