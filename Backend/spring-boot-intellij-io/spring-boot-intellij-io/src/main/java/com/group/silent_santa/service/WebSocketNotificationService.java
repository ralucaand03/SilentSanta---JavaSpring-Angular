package com.group.silent_santa.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.group.silent_santa.model.RequestsModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.HashMap;
import java.util.Map;

@Service
public class WebSocketNotificationService {

    private final SimpMessagingTemplate messagingTemplate;

    private final ObjectMapper objectMapper;

    public WebSocketNotificationService(SimpMessagingTemplate messagingTemplate,   ObjectMapper objectMapper) {
        this.messagingTemplate = messagingTemplate;
        this.objectMapper = objectMapper;
    }
    public void sendRequestStatusNotification(RequestsModel request, String status) {
        if (request == null || request.getUser() == null) {
            System.err.println("Cannot send notification: request or user is null");
            return;
        }
        Map<String, Object> notification = new HashMap<>();
        notification.put("type", "REQUEST_STATUS_UPDATE");
        notification.put("userId", request.getUser().getId());
        notification.put("letterTitle", request.getLetter().getTitle());
        notification.put("status", status);
        notification.put("timestamp", System.currentTimeMillis());

        String destination = "/topic/user/" + request.getUser().getId() + "/notifications";
        messagingTemplate.convertAndSend(destination, notification);
        System.out.println("Notification sent to " + destination + ": " + notification);
    }
}
