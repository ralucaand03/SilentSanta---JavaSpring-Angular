// src/main/java/com/group/silent_santa/dto/NotificationDTO.java
package com.group.silent_santa.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NotificationDTO {
    private UUID id;
    private String message;
    private UUID userId;
    private LocalDateTime timestamp;
    private NotificationType type;
    private boolean read;


    public enum NotificationType {
        CHAT_MESSAGE, REQUEST_UPDATE, SYSTEM
    }
}