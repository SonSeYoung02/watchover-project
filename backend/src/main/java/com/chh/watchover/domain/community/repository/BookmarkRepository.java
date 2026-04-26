package com.chh.watchover.domain.community.repository;

import com.chh.watchover.domain.community.model.entity.BookmarkEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;


public interface BookmarkRepository extends JpaRepository<BookmarkEntity, Long> {
    Optional<BookmarkEntity> findByUser_userIdAndPost_postId(Long userId, Long postId);
    Page<BookmarkEntity> findByUser_UserId(Long userId, Pageable pageable);
}
