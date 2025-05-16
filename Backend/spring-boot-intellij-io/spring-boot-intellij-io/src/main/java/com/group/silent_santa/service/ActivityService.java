package com.group.silent_santa.service;

import com.group.silent_santa.model.ActivityModel;
import com.group.silent_santa.model.UsersModel;
import com.group.silent_santa.repository.ActivityRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class ActivityService {

    private final ActivityRepository activityRepository;

    @Autowired
    public ActivityService(ActivityRepository activityRepository) {
        this.activityRepository = activityRepository;
    }

    public ActivityModel logActivity(UsersModel user, ActivityModel.ActivityType activityType,
                                     HttpServletRequest request) {
        String ipAddress = request.getRemoteAddr();
        String userAgent = request.getHeader("User-Agent");

        ActivityModel activity = new ActivityModel(user, activityType, ipAddress, userAgent);
        return activityRepository.save(activity);
    }

    public List<ActivityModel> getAllActivities() {
        return activityRepository.findAllByOrderByTimestampDesc();
    }

    public List<ActivityModel> getActivitiesByUser(UsersModel user) {
        return activityRepository.findByUser(user);
    }

    public List<ActivityModel> getActivitiesByType(ActivityModel.ActivityType activityType) {
        return activityRepository.findByActivityType(activityType);
    }

    public List<ActivityModel> getActivitiesByDateRange(LocalDateTime start, LocalDateTime end) {
        return activityRepository.findByTimestampBetween(start, end);
    }
}