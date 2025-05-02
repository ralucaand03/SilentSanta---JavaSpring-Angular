package com.group.silent_santa.service;

import com.group.silent_santa.model.*;
import com.group.silent_santa.repository.UsersRepository;
import com.group.silent_santa.repository.LettersRepository;
import com.group.silent_santa.repository.RequestsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RequestsService {

    private final RequestsRepository requestsRepository;

    private final UsersRepository usersRepository;
    private final LettersRepository lettersRepository;
    public List<LettersModel> getAllRequests(UUID userId) {
        return requestsRepository.findRequestLettersByUserId(userId);
    }


    public RequestsModel addRequest(UUID userId, UUID letterId) {
        if (requestsRepository.existsByUserIdAndLetterId(userId, letterId)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Letter is already in favorites");
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
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Favorite not found"));

        requestsRepository.delete(req);
    }

    public boolean acceptRequest(UUID requestId, UsersModel admin) {
        Optional<RequestsModel> optionalRequest = requestsRepository.findById(requestId);

        if (optionalRequest.isPresent()) {
            RequestsModel request = optionalRequest.get();

            // Check if the admin is the one who posted the letter
            if (!request.getLetter().getPostedBy().getId().equals(admin.getId())) {
                throw new SecurityException("You are not authorized to accept this request.");
            }

            request.setStatus(RequestsModel.RequestStatus.ACCEPTED);
            requestsRepository.save(request);
            return true;
        }
        return false;
    }

    public boolean denyRequest(UUID requestId, UsersModel admin) {
        Optional<RequestsModel> optionalRequest = requestsRepository.findById(requestId);

        if (optionalRequest.isPresent()) {
            RequestsModel request = optionalRequest.get();

            if (!request.getLetter().getPostedBy().getId().equals(admin.getId())) {
                throw new SecurityException("You are not authorized to deny this request.");
            }

            request.setStatus(RequestsModel.RequestStatus.DENIED);
            requestsRepository.save(request);
            return true;
        }
        return false;
    }

    public List<RequestsModel> getRequestsByUser(UsersModel user) {
        return requestsRepository.findByUser(user);
    }

    public boolean isRequested(UUID userId, UUID letterId) {
        return requestsRepository.existsByUserIdAndLetterId(userId, letterId);
    }

    public List<RequestsModel> getRequestsByLetter(LettersModel letter) {
        return requestsRepository.findByLetter(letter);
    }

    public List<LettersModel> getRequestedLettersByUser(UsersModel user) {
        // Find all requests made by the user
        List<RequestsModel> userRequests = requestsRepository.findByUser(user);

        // Extract and return the letters associated with those requests
        return userRequests.stream()
                .map(RequestsModel::getLetter)  // Extract the Letter from each Request
                .collect(Collectors.toList());
    }

    public List<LettersModel> getAcceptedLettersByUser(UsersModel user) {
        // Find all accepted requests made by the user
        List<RequestsModel> acceptedRequests = requestsRepository.findByUserAndStatus(
                user, RequestsModel.RequestStatus.ACCEPTED);

        // Extract and return the letters associated with those requests
        return acceptedRequests.stream()
                .map(RequestsModel::getLetter)
                .collect(Collectors.toList());
    }

    public List<LettersModel> getWaitingLettersByUser(UsersModel user) {
        // Find all waiting requests made by the user
        List<RequestsModel> waitingRequests = requestsRepository.findByUserAndStatus(
                user, RequestsModel.RequestStatus.WAITING);

        // Extract and return the letters associated with those requests
        return waitingRequests.stream()
                .map(RequestsModel::getLetter)
                .collect(Collectors.toList());
    }
    // Add this method to RequestsService.java
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
    //    public List<LettersModel> getRequestsForLetterOwner(UsersModel user) {
//        // Get all letters posted by this user
//        List<LettersModel> userLetters = lettersRepository.findByPostedBy(user);
//
//        if (userLetters.isEmpty()) {
//            return new ArrayList<>();
//        }
//
//        // Create a list to store letters that have requests
//        List<LettersModel> lettersWithRequests = new ArrayList<>();
//
//        // For each letter, check if it has requests
//        for (LettersModel letter : userLetters) {
//            List<RequestsModel> letterRequests = requestsRepository.findByLetter(letter);
//            if (!letterRequests.isEmpty()) {
//                lettersWithRequests.add(letter);
//            }
//        }
//
//        return lettersWithRequests;
//    }

}
