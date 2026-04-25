package com.chh.watchover.domain.community.repository;

import com.chh.watchover.domain.community.model.entity.CommentEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<CommentEntity, Long> {
    List<CommentEntity> findByPost_PostIdOrderByCreatedAtAsc(Long postId);
    Page<CommentEntity> findByUser_LoginId(String loginId, Pageable pageable);
}
