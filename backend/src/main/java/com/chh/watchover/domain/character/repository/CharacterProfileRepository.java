package com.chh.watchover.domain.character.repository;

import com.chh.watchover.domain.character.model.entity.CharacterProfileEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface CharacterProfileRepository extends JpaRepository<CharacterProfileEntity, Long> {
    // 특정 사용자의 최신 캐릭터 프로필을 가져오고 싶을 때 사용
    Optional<CharacterProfileEntity> findByUserUserId(Long userId);
}