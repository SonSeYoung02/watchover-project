package com.chh.watchover.repository;

import com.chh.watchover.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, Long> {

    boolean existsByLoginId(String loginId);

    boolean existsByEmail(String email);

    Optional<UserEntity> findByLoginId(String loginId);
}
