package com.chh.watchover.repository;

import com.chh.watchover.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, Long> {

    boolean existsByLoginId(String loginId);

    boolean existsByEmail(String email);

    UserEntity findByLoginId(String loginId);
}
