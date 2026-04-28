package com.chh.watchover.domain.chatbot.repository;

import com.chh.watchover.domain.chatbot.model.entity.ChatRoomEntity;
import com.chh.watchover.domain.user.model.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface ChatRoomRepository extends JpaRepository<ChatRoomEntity, Long> {
    List<ChatRoomEntity> findByUser_LoginIdOrderByCreatedAtDesc(String loginId);

    List<ChatRoomEntity> findByUserAndCreatedAtBetweenOrderByCreatedAtAsc(
            UserEntity user,
            LocalDateTime start,
            LocalDateTime end);

    Optional<ChatRoomEntity> findByChatRoomIdAndUser_LoginId(Long chatRoomId, String loginId);

    void deleteByUser_LoginId(String loginId);
}
