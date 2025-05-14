// src/main/java/com/group/silent_santa/model/ChatMessageModel.java
package com.group.silent_santa.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "chat_messages")
public class ChatMessageModel {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(nullable = false, length = 1000)
    private String content;

    @ManyToOne
    @JoinColumn(name = "sender_id", nullable = false)
    private UsersModel sender;

    @ManyToOne
    @JoinColumn(name = "recipient_id", nullable = false)
    private UsersModel recipient;

    @Column(name = "is_read", nullable = false)
    private boolean read;

    @Column(name = "timestamp", nullable = false)
    private java.time.LocalDateTime timestamp;
}