package com.group.silent_santa.controller;

import com.group.silent_santa.DTO.NotificationDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.ResponseBody;

import java.time.LocalDateTime;
import java.util.UUID;

@Controller
public class WebSocketDebugController {
    private final SimpMessagingTemplate messagingTemplate;

    @Autowired
    public WebSocketDebugController(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @GetMapping("/api/debug/test-notification/{userId}")
    @ResponseBody
    public String sendTestNotification(@PathVariable UUID userId) {
        try {
            // Create a test notification
            NotificationDTO notification = new NotificationDTO();
            notification.setId(UUID.randomUUID());
            notification.setUserId(userId);
            notification.setMessage("Test notification from server at " + LocalDateTime.now());
            notification.setTimestamp(LocalDateTime.now());
            notification.setType(NotificationDTO.NotificationType.SYSTEM);
            notification.setRead(false);

            // Log what we're sending
            System.out.println("Sending test notification to user: " + userId);
            System.out.println("Destination: /user/" + userId + "/queue/notifications");
            System.out.println("Notification: " + notification);

            // Send notification using convertAndSendToUser
            messagingTemplate.convertAndSendToUser(
                    userId.toString(),
                    "/queue/notifications",
                    notification
            );

            // Also send a broadcast message
            NotificationDTO broadcastNotification = new NotificationDTO();
            broadcastNotification.setId(UUID.randomUUID());
            broadcastNotification.setUserId(userId);
            broadcastNotification.setMessage("Broadcast test notification at " + LocalDateTime.now());
            broadcastNotification.setTimestamp(LocalDateTime.now());
            broadcastNotification.setType(NotificationDTO.NotificationType.SYSTEM);
            broadcastNotification.setRead(false);

            messagingTemplate.convertAndSend("/topic/notifications", broadcastNotification);

            return "Test notifications sent successfully";
        } catch (Exception e) {
            e.printStackTrace();
            return "Error sending notification: " + e.getMessage();
        }
    }
}

