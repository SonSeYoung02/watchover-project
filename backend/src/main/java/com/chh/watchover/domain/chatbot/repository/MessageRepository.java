package com.chh.watchover.domain.chatbot.repository;

import com.chh.watchover.domain.chatbot.model.entity.MessageEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MessageRepository extends JpaRepository<MessageEntity, Long> {
    // 특정 채팅방의 메시지를 시간순으로 가져오기
    List<MessageEntity> findByChatRoomChatRoomIdOrderByCreatedAtAsc(Long chatRoomId);
}
