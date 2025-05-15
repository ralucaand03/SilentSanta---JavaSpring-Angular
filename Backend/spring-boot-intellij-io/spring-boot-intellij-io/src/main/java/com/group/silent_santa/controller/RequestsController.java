package com.group.silent_santa.controller;

import com.group.silent_santa.DTO.LetterRequestDTO;
import com.group.silent_santa.DTO.NotificationDTO;
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
            Optional<RequestsModel> requestOpt = requestsRepository.findById(requestId);
            if (requestOpt.isPresent()) {
                RequestsModel request = requestOpt.get();

                System.out.println("Request accepted. Sending notification to user: " + request.getUser().getId());

                // Create notification
                NotificationDTO notification = new NotificationDTO();
                notification.setId(UUID.randomUUID());
                notification.setUserId(request.getUser().getId());
                notification.setMessage("Your request for letter from " + request.getLetter().getChildName() + " has been accepted.");
                notification.setTimestamp(LocalDateTime.now());
                notification.setType(NotificationDTO.NotificationType.REQUEST_UPDATE);
                notification.setRead(false);

                // Convert UUID to string for messaging
                String userIdStr = request.getUser().getId().toString();

                try {
                    // More explicit destination path
                    String destination = "/user/" + userIdStr + "/queue/notifications";
                    System.out.println("Sending to destination: " + destination);

                    // Try direct path (alternative method)
                    messagingTemplate.convertAndSend("/queue/notifications." + userIdStr, notification);

                    // Also try with convertAndSendToUser
                    messagingTemplate.convertAndSendToUser(
                            userIdStr,
                            "/queue/notifications",
                            notification
                    );

                    // For debugging: Broadcast to all users as well
                    messagingTemplate.convertAndSend("/topic/notifications", notification);

                    System.out.println("Notification sent successfully");
                } catch (Exception e) {
                    System.err.println("Error sending notification: " + e.getMessage());
                    e.printStackTrace();
                }
            }

            // Return JSON response
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
//here send msg to user " ... accepted your request ..."
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
