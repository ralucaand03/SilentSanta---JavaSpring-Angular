// src/main/java/com/group/silent_santa/repository/ChatMessageRepository.java
package com.group.silent_santa.repository;

import com.group.silent_santa.model.ChatMessageModel;
import com.group.silent_santa.model.UsersModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessageModel, UUID> {
    List<ChatMessageModel> findBySenderAndRecipientOrderByTimestampAsc(UsersModel sender, UsersModel recipient);

    List<ChatMessageModel> findByRecipientAndReadFalse(UsersModel recipient);

    // Get conversation between two users
    default List<ChatMessageModel> findConversation(UsersModel user1, UsersModel user2) {
        List<ChatMessageModel> sentMessages = findBySenderAndRecipientOrderByTimestampAsc(user1, user2);
        List<ChatMessageModel> receivedMessages = findBySenderAndRecipientOrderByTimestampAsc(user2, user1);

        // Combine and sort by timestamp
        sentMessages.addAll(receivedMessages);
        sentMessages.sort((m1, m2) -> m1.getTimestamp().compareTo(m2.getTimestamp()));

        return sentMessages;
    }
}