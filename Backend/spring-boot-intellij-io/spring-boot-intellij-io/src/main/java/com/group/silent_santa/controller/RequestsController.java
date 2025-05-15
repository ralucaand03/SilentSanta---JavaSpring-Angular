package com.group.silent_santa.controller;

import com.group.silent_santa.DTO.LetterRequestDTO;
import com.group.silent_santa.model.*;
import com.group.silent_santa.repository.RequestsRepository;
import com.group.silent_santa.repository.UsersRepository;
import com.group.silent_santa.service.RequestsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/requests")
@CrossOrigin(origins = "*")
public class RequestsController {
    @Autowired
    private RequestsService requestsService;
    @Autowired
    private UsersRepository usersRepository;
    @Autowired
    private RequestsRepository requestsRepository;
    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public RequestsController(RequestsService requestsService, RequestsRepository requestsRepository,
                              UsersRepository usersRepository,
                              SimpMessagingTemplate messagingTemplate) {
        this.requestsService = requestsService;
        this.requestsRepository = requestsRepository;
        this.usersRepository = usersRepository;
        this.messagingTemplate = messagingTemplate;
    }

    // Get all requests made by a user
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserRequests(@PathVariable UUID userId) {
        List<LettersModel> req = requestsService.getAllRequests(userId);
        return ResponseEntity.ok(req);
    }

    // Get all requests for letters posted by a user
    @GetMapping("/letter-owner/{userId}")
    public ResponseEntity<?> getLetterOwnerRequests(@PathVariable UUID userId) {
        Optional<UsersModel> userOpt = usersRepository.findById(userId);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
        List<LetterRequestDTO> letterRequests = requestsService.getLetterRequestsForOwner(userOpt.get());
        return ResponseEntity.ok(letterRequests);
    }

    @PostMapping("/user/{userId}/letter/{letterId}")
    public ResponseEntity<RequestsModel> addRequest(@PathVariable UUID userId, @PathVariable UUID letterId) {
        RequestsModel request = requestsService.addRequest(userId, letterId);
        return ResponseEntity.status(HttpStatus.CREATED).body(request);
    }

    @PutMapping("/{requestId}/accept")
    public ResponseEntity<?> acceptedRequest(@PathVariable UUID requestId, @RequestBody UsersModel admin) {
        boolean isAccepted = requestsService.acceptRequest(requestId, admin);
        if (isAccepted) {
            System.out.println("Request accepted and notification sent.");
            return ResponseEntity.ok().body(Map.of(
                    "status", "success",
                    "message", "Request accepted and notification sent."
            ));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
                    "status", "failure",
                    "message", "Request not found or could not be accepted."
            ));
        }
    }

    @PutMapping("/{requestId}/deny")
     public ResponseEntity<?> deniedRequest(@PathVariable UUID requestId, @RequestBody UsersModel admin) {
         boolean isDenied = requestsService.denyRequest(requestId, admin) ;
        if (isDenied) {
            System.out.println("Request denied and notification sent.");
            return ResponseEntity.ok().body(Map.of(
                    "status", "success",
                    "message", "Request denied and notification sent."
            ));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
                    "status", "failure",
                    "message", "Request not found or could not be accepted."
            ));
        }
    }

    // Check if a request exists
    @GetMapping("/user/{userId}/letter/{letterId}")
    public ResponseEntity<Map<String, Boolean>> checkRequest(
            @PathVariable UUID userId,
            @PathVariable UUID letterId) {
        boolean isRequested = requestsService.isRequested(userId, letterId);
        return ResponseEntity.ok(Map.of("isFavorite", isRequested));
    }
}
