package com.group.silent_santa.controller;

import com.group.silent_santa.model.LettersModel;
import com.group.silent_santa.model.RequestsModel;
import com.group.silent_santa.model.UsersModel;
import com.group.silent_santa.service.LettersService;
import com.group.silent_santa.service.RequestsService;
import com.group.silent_santa.service.UsersService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/requests")
@CrossOrigin(origins = "http://localhost:4200")
@RequiredArgsConstructor
public class RequestsController {

    private final RequestsService requestsService;
    private final UsersService usersService;
    private final LettersService lettersService;

    @PostMapping
    public ResponseEntity<?> createRequest(@RequestBody Map<String, String> requestData, Principal principal) {
        try {
            String letterId = requestData.get("letterId");

            // Get the current user
            UsersModel currentUser = usersService.findByEmail(principal.getName());
            if (currentUser == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
            }

            // Get the letter
            LettersModel letter = lettersService.getLetterById(UUID.fromString(letterId));
            if (letter == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Letter not found");
            }

            // Create the request
            RequestsModel request = requestsService.addRequest(currentUser, letter);
            return ResponseEntity.ok(request);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error creating request: " + e.getMessage());
        }
    }

    @GetMapping("/user")
    public ResponseEntity<?> getUserRequests(Principal principal) {
        try {
            UsersModel currentUser = usersService.findByEmail(principal.getName());
            if (currentUser == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
            }

            List<RequestsModel> requests = requestsService.getRequestsByUser(currentUser);
            return ResponseEntity.ok(requests);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error fetching requests: " + e.getMessage());
        }
    }

    @GetMapping("/letter/{letterId}")
    public ResponseEntity<?> getRequestsForLetter(@PathVariable String letterId, Principal principal) {
        try {
            UsersModel currentUser = usersService.findByEmail(principal.getName());
            if (currentUser == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
            }

            LettersModel letter = lettersService.getLetterById(UUID.fromString(letterId));
            if (letter == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Letter not found");
            }

            // Check if the user is the one who posted the letter
            if (!letter.getPostedBy().getId().equals(currentUser.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You are not authorized to view these requests");
            }

            List<RequestsModel> requests = requestsService.getRequestsByLetter(letter);
            return ResponseEntity.ok(requests);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error fetching requests: " + e.getMessage());
        }
    }

    @PutMapping("/{requestId}/accept")
    public ResponseEntity<?> acceptRequest(@PathVariable String requestId, Principal principal) {
        try {
            UsersModel currentUser = usersService.findByEmail(principal.getName());
            if (currentUser == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
            }

            boolean success = requestsService.acceptRequest(UUID.fromString(requestId), currentUser);
            if (success) {
                return ResponseEntity.ok().body("Request accepted successfully");
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Request not found");
            }
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error accepting request: " + e.getMessage());
        }
    }

    @PutMapping("/{requestId}/deny")
    public ResponseEntity<?> denyRequest(@PathVariable String requestId, Principal principal) {
        try {
            UsersModel currentUser = usersService.findByEmail(principal.getName());
            if (currentUser == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
            }

            boolean success = requestsService.denyRequest(UUID.fromString(requestId), currentUser);
            if (success) {
                return ResponseEntity.ok().body("Request denied successfully");
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Request not found");
            }
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error denying request: " + e.getMessage());
        }
    }
}
