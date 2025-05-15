package com.group.silent_santa.controller;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class WebSocketNotificationController {

    private final SimpMessagingTemplate messagingTemplate;

    public WebSocketNotificationController(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/sendMessage")
    @SendTo("/topic/notifications")
    public String sendMessage(String message) {
        System.out.println("Received message: " + message);
        return message;
    }

    @MessageMapping("/user/{userId}/subscribe")
    public void subscribeUser(@DestinationVariable String userId) {
        System.out.println("User subscribed: " + userId);
        messagingTemplate.convertAndSend("/topic/user/" + userId + "/notifications",
                "{\"type\":\"WELCOME\",\"message\":\"You are now subscribed to notifications\"}");
    }
}