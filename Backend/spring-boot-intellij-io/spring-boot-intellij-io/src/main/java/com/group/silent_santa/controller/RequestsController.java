package com.group.silent_santa.controller;

import com.group.silent_santa.DTO.LetterRequestDTO;
import com.group.silent_santa.DTO.NotificationDTO;
import com.group.silent_santa.model.*;
import com.group.silent_santa.repository.LettersRepository;
import com.group.silent_santa.repository.RequestsRepository;
import com.group.silent_santa.repository.UsersRepository;
import com.group.silent_santa.service.RequestsService;
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

    private RequestsService requestsService;
    private UsersRepository usersRepository;
    private LettersRepository lettersRepository;
    private RequestsRepository requestsRepository;
    private SimpMessagingTemplate messagingTemplate;

    public RequestsController(RequestsService requestsService, RequestsRepository requestsRepository,
                              UsersRepository usersRepository, LettersRepository lettersRepository,
                              SimpMessagingTemplate messagingTemplate) {
        this.requestsService = requestsService;
        this.requestsRepository = requestsRepository;
        this.usersRepository = usersRepository;
        this.lettersRepository = lettersRepository;
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
            // Get the request to access user information
            Optional<RequestsModel> requestOpt = requestsRepository.findById(requestId);
            if (requestOpt.isPresent()) {
                RequestsModel request = requestOpt.get();

                // Create and send notification
                NotificationDTO notification = new NotificationDTO();
                notification.setId(UUID.randomUUID());
                notification.setUserId(request.getUser().getId());
                notification.setMessage("Your request for letter from " + request.getLetter().getChildName() + " has been accepted.");
                notification.setTimestamp(LocalDateTime.now());
                notification.setType(NotificationDTO.NotificationType.REQUEST_UPDATE);
                notification.setRead(false);

                // Send notification via WebSocket
                messagingTemplate.convertAndSendToUser(
                        request.getUser().getId().toString(),
                        "/queue/notifications",
                        notification
                );

                System.out.println("Sent acceptance notification to user: " + request.getUser().getId());
            }

            // Return JSON response instead of plain text
            Map<String, String> response = new HashMap<>();
            response.put("status", "success");
            response.put("message", "Request Accepted");
            return ResponseEntity.ok(response);
        } else {
            Map<String, String> response = new HashMap<>();
            response.put("status", "error");
            response.put("message", "Failed to Accept Request");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @PutMapping("/{requestId}/deny")
    public ResponseEntity<?> deniedRequest(@PathVariable UUID requestId, @RequestBody UsersModel admin) {
        boolean isDenied = requestsService.denyRequest(requestId, admin);

        if (isDenied) {
            // Get the request to access user information
            Optional<RequestsModel> requestOpt = requestsRepository.findById(requestId);
            if (requestOpt.isPresent()) {
                RequestsModel request = requestOpt.get();

                // Create and send notification
                NotificationDTO notification = new NotificationDTO();
                notification.setId(UUID.randomUUID());
                notification.setUserId(request.getUser().getId());
                notification.setMessage("Your request for letter from " + request.getLetter().getChildName() + " has been denied.");
                notification.setTimestamp(LocalDateTime.now());
                notification.setType(NotificationDTO.NotificationType.SYSTEM);
                notification.setRead(false);

                // Send notification via WebSocket
                messagingTemplate.convertAndSendToUser(
                        request.getUser().getId().toString(),
                        "/queue/notifications",
                        notification
                );

                System.out.println("Sent denial notification to user: " + request.getUser().getId());
            }

            // Return JSON response instead of plain text
            Map<String, String> response = new HashMap<>();
            response.put("status", "success");
            response.put("message", "Request Denied");
            return ResponseEntity.ok(response);
        } else {
            Map<String, String> response = new HashMap<>();
            response.put("status", "error");
            response.put("message", "Failed to Deny Request");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
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
