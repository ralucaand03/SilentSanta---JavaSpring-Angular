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
@Table(name = "user_activities")
public class ActivityModel {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private UsersModel user;

    @Enumerated(EnumType.STRING)
    private ActivityType activityType;

    private LocalDateTime timestamp;

    private String ipAddress;

    private String userAgent;

    public enum ActivityType {
        LOGIN, LOGOUT
    }

    @PrePersist
    public void onCreate() {
        this.timestamp = LocalDateTime.now();
    }

    // Constructor without id for creating new activities
    public ActivityModel(UsersModel user, ActivityType activityType, String ipAddress, String userAgent) {
        this.user = user;
        this.activityType = activityType;
        this.timestamp = LocalDateTime.now();
        this.ipAddress = ipAddress;
        this.userAgent = userAgent;
    }
}