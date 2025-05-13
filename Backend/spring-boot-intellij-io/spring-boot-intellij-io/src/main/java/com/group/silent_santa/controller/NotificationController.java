package com.group.silent_santa.controller;

import com.group.silent_santa.DTO.NotificationDTO;
import com.group.silent_santa.model.UsersModel;
import com.group.silent_santa.repository.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.ResponseBody;

import java.time.LocalDateTime;
import java.util.UUID;

@Controller
public class NotificationController {
    private final SimpMessagingTemplate messagingTemplate;

    @Autowired
    public NotificationController(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/sendMessage")
    public void sendNotification(NotificationDTO notification) {
        notification.setId(UUID.randomUUID());
        notification.setTimestamp(LocalDateTime.now());

        messagingTemplate.convertAndSendToUser(
                notification.getUserId().toString(),
                "/queue/notifications",
                notification
        );
    }

    @MessageMapping("/sendBroadcast")
    @SendTo("/topic/notifications")
    public NotificationDTO sendBroadcast(NotificationDTO notification) {
        notification.setId(UUID.randomUUID());
        notification.setTimestamp(LocalDateTime.now());
        return notification;
    }
}
