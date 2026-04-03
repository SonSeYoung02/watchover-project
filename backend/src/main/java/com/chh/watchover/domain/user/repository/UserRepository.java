package com.chh.watchover.domain.user.repository;

import com.chh.watchover.domain.user.model.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, Long> {

    boolean existsByLoginId(String loginId);

    boolean existsByEmail(String email);

    Optional<UserEntity> findByLoginId(String loginId);

    Long loginId(String loginId);
}
