package com.group.silent_santa.service;

import com.group.silent_santa.DTO.LetterRequestDTO;
import com.group.silent_santa.model.*;
import com.group.silent_santa.repository.UsersRepository;
import com.group.silent_santa.repository.LettersRepository;
import com.group.silent_santa.repository.RequestsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.messaging.simp.SimpMessagingTemplate; // Import SimpMessagingTemplate
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime; // Import LocalDateTime
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
// import java.util.stream.Collectors; // Not used in this snippet

@Service
@RequiredArgsConstructor
public class RequestsService {

    private final RequestsRepository requestsRepository;
    private final UsersRepository usersRepository;
    private final LettersRepository lettersRepository;
    private final SimpMessagingTemplate messagingTemplate; // Autowire SimpMessagingTemplate
    private final WebSocketNotificationService webSocketNotificationService;
    public List<LettersModel> getAllRequests(UUID userId) {
        return requestsRepository.findRequestLettersByUserId(userId);
    }


    public RequestsModel addRequest(UUID userId, UUID letterId) {
        if (requestsRepository.existsByUserIdAndLetterId(userId, letterId)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Letter is already in requests");
        }

        UsersModel user = usersRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        LettersModel letter = lettersRepository.findById(letterId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Letter not found"));

        RequestsModel request = new RequestsModel();
        request.setUser(user);
        request.setLetter(letter);
        request.setStatus(RequestsModel.RequestStatus.WAITING); // Default status

        return requestsRepository.save(request);
    }

    public void removeRequest(UUID userId, UUID letterId) {
        RequestsModel req = requestsRepository.findByUserIdAndLetterId(userId, letterId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Request not found"));

        requestsRepository.delete(req);
    }

    public boolean acceptRequest(UUID requestId, UsersModel admin) {
        Optional<RequestsModel> optionalRequest = requestsRepository.findById(requestId);
        if (optionalRequest.isPresent()) {
            RequestsModel request = optionalRequest.get();
            if (!request.getLetter().getPostedBy().getId().equals(admin.getId()) /* && !admin.getRole().equals("ADMIN_ROLE_NAME") */) {
                // Consider a more specific exception or handling for authorization
                throw new SecurityException("You are not authorized to accept this request.");
            }
            request.setStatus(RequestsModel.RequestStatus.ACCEPTED);
            requestsRepository.save(request);
            // Send notification to the user who made the request
            webSocketNotificationService.sendRequestStatusNotification(request, "accepted");
            return true;
        }
        return false;
    }

      public boolean denyRequest(UUID requestId, UsersModel admin) {
         Optional<RequestsModel> optionalRequest = requestsRepository.findById(requestId);
         if (optionalRequest.isPresent()) {
             RequestsModel request = optionalRequest.get();
             if (!request.getLetter().getPostedBy().getId().equals(admin.getId()) /* && !admin.getRole().equals("ADMIN_ROLE_NAME") */) {
                 // Consider a more specific exception or handling for authorization
                 throw new SecurityException("You are not authorized to accept this request.");
             }
             request.setStatus(RequestsModel.RequestStatus.DENIED);
             requestsRepository.save(request);
             // Send notification to the user who made the request
             webSocketNotificationService.sendRequestStatusNotification(request, "denied");
             return true;
         }
          return false;
     }

    public boolean isRequested(UUID userId, UUID letterId) {
        return requestsRepository.existsByUserIdAndLetterId(userId, letterId);
    }

    public List<LetterRequestDTO> getLetterRequestsForOwner(UsersModel user) {
        // Get all letters posted by this user
        List<LettersModel> userLetters = lettersRepository.findByPostedBy(user);

        if (userLetters.isEmpty()) {
            return new ArrayList<>();
        }

        // Create a list to store letter requests
        List<LetterRequestDTO> letterRequests = new ArrayList<>();

        // For each letter, get all requests and convert to DTOs
        for (LettersModel letter : userLetters) {
            List<RequestsModel> requests = requestsRepository.findByLetter(letter);
            for (RequestsModel request : requests) {
                letterRequests.add(LetterRequestDTO.fromRequestModel(request));
            }
        }
        return letterRequests;
    }
}
