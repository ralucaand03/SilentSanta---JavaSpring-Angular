package com.group.silent_santa.controller;

import com.group.silent_santa.model.*;
import com.group.silent_santa.repository.LettersRepository;
import com.group.silent_santa.repository.RequestsRepository;
import com.group.silent_santa.repository.UsersRepository;
import com.group.silent_santa.service.FavoritesService;
import com.group.silent_santa.service.RequestsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
    public RequestsController(RequestsService requestsService,RequestsRepository requestsRepository,
                              UsersRepository usersRepository,LettersRepository lettersRepository) {
        this.requestsService= requestsService;

        this.usersRepository= usersRepository;
        this.lettersRepository= lettersRepository;
    }
    // Get all requests made by a user
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserRequests(@PathVariable UUID userId) {
        List<LettersModel> req = requestsService.getAllRequests(userId);
        return ResponseEntity.ok(req);
    }

    // Get all requests for letters posted by a user
// Update this method in RequestsController.java
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
    public ResponseEntity<RequestsModel> addRequest(
            @PathVariable UUID userId,
            @PathVariable UUID letterId) {
        RequestsModel request = requestsService.addRequest(userId, letterId);
        return ResponseEntity.status(HttpStatus.CREATED).body(request);
    }

//    @PutMapping("/{requestId}/status")
//    public ResponseEntity<?> updateRequestStatus(
//            @PathVariable UUID requestId,
//            @RequestBody Map<String, String> statusUpdate) {
//        String status = statusUpdate.get("status");
//        if (status == null) {
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Status is required");
//        }
//        Optional<RequestsModel> requestOpt = requestsRepository.findById(requestId);
//        if (requestOpt.isEmpty()) {
//            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Request not found");
//        }
//        RequestsModel request = requestOpt.get();
//        try {
//            RequestsModel.RequestStatus newStatus = RequestsModel.RequestStatus.valueOf(status);
//            request.setStatus(newStatus);
//            if (newStatus == RequestsModel.RequestStatus.ACCEPTED) {
//                LettersModel letter = request.getLetter();
//                letter.setStatus(LettersModel.LetterStatus.WORKING);
//                lettersRepository.save(letter);
//            }
//
//            RequestsModel updatedRequest = requestsRepository.save(request);
//            return ResponseEntity.ok(updatedRequest);
//        } catch (IllegalArgumentException e) {
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid status value");
//        }
//    }

    // Check if a request exists
    @GetMapping("/user/{userId}/letter/{letterId}")
    public ResponseEntity<Map<String, Boolean>> checkRequest(
            @PathVariable UUID userId,
            @PathVariable UUID letterId) {
        boolean isRequested = requestsService.isRequested(userId, letterId);
        return ResponseEntity.ok(Map.of("isFavorite", isRequested));
    }

    // Delete a request
//    @DeleteMapping("/{requestId}")
//    public ResponseEntity<?> deleteRequest(@PathVariable UUID requestId) {
//        Optional<RequestsModel> requestOpt = requestsRepository.findById(requestId);
//        if (requestOpt.isEmpty()) {
//            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Request not found");
//        }
//
//        requestsRepository.deleteById(requestId);
//        return ResponseEntity.ok().build();
//    }
}
