package com.group.silent_santa.repository;

import com.group.silent_santa.model.ActivityModel;
import com.group.silent_santa.model.UsersModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface ActivityRepository extends JpaRepository<ActivityModel, UUID> {

    List<ActivityModel> findByUser(UsersModel user);

    List<ActivityModel> findByActivityType(ActivityModel.ActivityType activityType);

    List<ActivityModel> findByTimestampBetween(LocalDateTime start, LocalDateTime end);

    List<ActivityModel> findAllByOrderByTimestampDesc();
}