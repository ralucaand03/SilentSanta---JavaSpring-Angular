package com.group.silent_santa.controller;

import com.group.silent_santa.model.ActivityModel;
import com.group.silent_santa.model.UsersModel;
import com.group.silent_santa.service.ActivityService;
import com.group.silent_santa.service.UsersService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/activities")
public class ActivityController {

    private final ActivityService activityService;
    private final UsersService usersService;

    @Autowired
    public ActivityController(ActivityService activityService, UsersService usersService) {
        this.activityService = activityService;
        this.usersService = usersService;
    }

    @PostMapping("/log")
    public ResponseEntity<?> logActivity(@RequestBody Map<String, String> payload, HttpServletRequest request) {
        try {
            String userId = payload.get("userId");
            String activityTypeStr = payload.get("activityType");

            if (userId == null || activityTypeStr == null) {
                return ResponseEntity.badRequest().body("userId and activityType are required");
            }

            UsersModel user = usersService.getUserById(UUID.fromString(userId));
            if (user == null) {
                return ResponseEntity.badRequest().body("User not found");
            }

            ActivityModel.ActivityType activityType;
            try {
                activityType = ActivityModel.ActivityType.valueOf(activityTypeStr);
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest().body("Invalid activity type");
            }

            // Use the service to log the activity
            activityService.logActivity(user, activityType, request);

            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error logging activity: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<ActivityModel>> getAllActivities() {
        return ResponseEntity.ok(activityService.getAllActivities());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ActivityModel>> getActivitiesByUser(@PathVariable UUID userId) {
        UsersModel user = usersService.getUserById(userId);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(activityService.getActivitiesByUser(user));
    }

    // Add missing endpoints to match frontend service
    @GetMapping("/type/{type}")
    public ResponseEntity<List<ActivityModel>> getActivitiesByType(@PathVariable String type) {
        try {
            ActivityModel.ActivityType activityType = ActivityModel.ActivityType.valueOf(type.toUpperCase());
            return ResponseEntity.ok(activityService.getActivitiesByType(activityType));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/date-range")
    public ResponseEntity<List<ActivityModel>> getActivitiesByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        return ResponseEntity.ok(activityService.getActivitiesByDateRange(start, end));
    }
}