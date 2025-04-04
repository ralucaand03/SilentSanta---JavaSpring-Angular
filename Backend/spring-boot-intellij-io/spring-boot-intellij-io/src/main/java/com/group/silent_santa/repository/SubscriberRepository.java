package com.group.silent_santa.repository;

import com.group.silent_santa.model.SubscriberModel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface SubscriberRepository extends JpaRepository<SubscriberModel, UUID> {
    boolean existsByEmail(String email);
}
