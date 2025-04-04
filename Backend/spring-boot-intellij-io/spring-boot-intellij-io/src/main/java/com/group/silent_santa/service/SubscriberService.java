package com.group.silent_santa.service;

import com.group.silent_santa.model.SubscriberModel;
import com.group.silent_santa.repository.SubscriberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SubscriberService {

    private final SubscriberRepository subscriberRepository;

    @Autowired
    public SubscriberService(SubscriberRepository subscriberRepository) {
        this.subscriberRepository = subscriberRepository;
    }

    public String subscribe(String email) {
        if (subscriberRepository.existsByEmail(email)) {
            return "Email is already subscribed";
        }

        SubscriberModel newSubscriber = new SubscriberModel(email);
        subscriberRepository.save(newSubscriber);
        return "Subscribed successfully!";
    }
}
