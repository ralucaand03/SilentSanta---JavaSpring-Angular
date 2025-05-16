package com.group.silent_santa.controller;

import com.group.silent_santa.model.ActivityModel;
import com.group.silent_santa.model.UsersModel;
import com.group.silent_santa.service.ActivityService;
import com.group.silent_santa.service.UsersService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
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

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ActivityModel>> getAllActivities() {
        return ResponseEntity.ok(activityService.getAllActivities());
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ActivityModel>> getActivitiesByUser(@PathVariable UUID userId) {
        UsersModel user = usersService.getUserById(userId);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(activityService.getActivitiesByUser(user));
    }

    @GetMapping("/type/{type}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ActivityModel>> getActivitiesByType(@PathVariable String type) {
        try {
            ActivityModel.ActivityType activityType = ActivityModel.ActivityType.valueOf(type.toUpperCase());
            return ResponseEntity.ok(activityService.getActivitiesByType(activityType));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/date-range")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ActivityModel>> getActivitiesByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        return ResponseEntity.ok(activityService.getActivitiesByDateRange(start, end));
    }
}