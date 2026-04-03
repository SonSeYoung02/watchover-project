package com.chh.watchover.domain.chatbot.repository;

import com.chh.watchover.domain.chatbot.model.entity.ChatRoomEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChatRoomRepository extends JpaRepository<ChatRoomEntity, Long> {
}
