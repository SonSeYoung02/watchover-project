package com.chh.watchover.domain.community.repository;

import com.chh.watchover.domain.community.model.entity.PostEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface PostRepository extends JpaRepository<PostEntity, Long> {
    Page<PostEntity> findByUser_LoginId(String loginId, Pageable pageable);
}
