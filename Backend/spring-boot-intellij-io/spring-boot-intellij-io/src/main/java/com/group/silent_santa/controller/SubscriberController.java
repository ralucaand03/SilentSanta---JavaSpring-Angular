package com.group.silent_santa.controller;

import com.group.silent_santa.service.SubscriberService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/subscriber")
@CrossOrigin(origins = "http://localhost:4200")
public class SubscriberController {

    private final SubscriberService subscriberService;

    @Autowired
    public SubscriberController(SubscriberService subscriberService) {
        this.subscriberService = subscriberService;
    }

    @PostMapping("/subscribe")
    public String subscribeToNewsletter(@RequestBody String email) {
        return subscriberService.subscribe(email);
    }
}
