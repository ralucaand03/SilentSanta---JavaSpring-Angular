// src/main/java/com/group/silent_santa/controller/ChatController.java
package com.group.silent_santa.controller;

import com.group.silent_santa.DTO.ChatMessageDTO;
import com.group.silent_santa.DTO.NotificationDTO;
import com.group.silent_santa.model.ChatMessageModel;
import com.group.silent_santa.model.UsersModel;
import com.group.silent_santa.repository.ChatMessageRepository;
import com.group.silent_santa.repository.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.ResponseBody;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Controller
public class ChatController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private ChatMessageRepository chatMessageRepository;

    @Autowired
    private UsersRepository usersRepository;

    // Handle chat messages sent from clients
    @MessageMapping("/chat.sendMessage")
    public void sendMessage(@Payload ChatMessageDTO chatMessageDTO) {
        chatMessageDTO.setTimestamp(LocalDateTime.now());

        // Save message to database
        Optional<UsersModel> senderOpt = usersRepository.findById(chatMessageDTO.getSenderId());
        Optional<UsersModel> recipientOpt = usersRepository.findById(chatMessageDTO.getRecipientId());

        if (senderOpt.isPresent() && recipientOpt.isPresent()) {
            UsersModel sender = senderOpt.get();
            UsersModel recipient = recipientOpt.get();

            ChatMessageModel message = new ChatMessageModel();
            message.setContent(chatMessageDTO.getContent());
            message.setSender(sender);
            message.setRecipient(recipient);
            message.setTimestamp(LocalDateTime.now());
            chatMessageRepository.save(message);

            // Send message to recipient
            messagingTemplate.convertAndSendToUser(
                    recipient.getId().toString(),
                    "/queue/messages",
                    chatMessageDTO
            );

            // Send notification to recipient
            NotificationDTO notification = new NotificationDTO();
            notification.setId(UUID.randomUUID());
            notification.setMessage("New message from " + sender.getFirstName()+ sender.getLastName());
            notification.setUserId(recipient.getId());
            notification.setTimestamp(LocalDateTime.now());
            notification.setType(NotificationDTO.NotificationType.CHAT_MESSAGE);

            messagingTemplate.convertAndSendToUser(
                    recipient.getId().toString(),
                    "/queue/notifications",
                    notification
            );
        }
    }

    // REST endpoint to get chat history
    @GetMapping("/api/chat/history/{userId1}/{userId2}")
    @ResponseBody
    public List<ChatMessageDTO> getChatHistory(@PathVariable UUID userId1, @PathVariable UUID userId2) {
        Optional<UsersModel> user1Opt = usersRepository.findById(userId1);
        Optional<UsersModel> user2Opt = usersRepository.findById(userId2);

        if (user1Opt.isPresent() && user2Opt.isPresent()) {
            UsersModel user1 = user1Opt.get();
            UsersModel user2 = user2Opt.get();

            List<ChatMessageModel> conversation = chatMessageRepository.findConversation(user1, user2);

            // Mark messages as read
            conversation.stream()
                    .filter(msg -> msg.getRecipient().getId().equals(userId1) && !msg.isRead())
                    .forEach(msg -> {
                        msg.setRead(true);
                        chatMessageRepository.save(msg);
                    });

            // Convert to DTOs
            return conversation.stream()
                    .map(msg -> {
                        ChatMessageDTO dto = new ChatMessageDTO();
                        dto.setId(msg.getId());
                        dto.setContent(msg.getContent());
                        dto.setSenderId(msg.getSender().getId());
                        dto.setSenderName(msg.getSender().getFirstName());
                        dto.setRecipientId(msg.getRecipient().getId());
                        dto.setTimestamp(msg.getTimestamp());
                        dto.setType(ChatMessageDTO.MessageType.CHAT);
                        return dto;
                    })
                    .collect(Collectors.toList());
        }

        return List.of();
    }
}