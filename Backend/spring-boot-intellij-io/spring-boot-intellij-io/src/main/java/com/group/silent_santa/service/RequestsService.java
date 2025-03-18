package com.group.silent_santa.service;

import com.group.silent_santa.model.LettersModel;
import com.group.silent_santa.model.RequestsModel;
import com.group.silent_santa.model.UsersModel;
import com.group.silent_santa.repository.RequestsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RequestsService {

    private final RequestsRepository requestsRepository;

    public RequestsModel addRequest(UsersModel user, LettersModel letter) {
        RequestsModel request = new RequestsModel();
        request.setUser(user);
        request.setLetter(letter);
        request.setStatus(RequestsModel.RequestStatus.WAITING); // Default status

        return requestsRepository.save(request);
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
    public List<LettersModel> getRequestedLettersByUser(UsersModel user) {
        // Find all requests made by the user
        List<RequestsModel> userRequests = requestsRepository.findByUser(user);

        // Extract and return the letters associated with those requests
        return userRequests.stream()
                .map(RequestsModel::getLetter)  // Extract the Letter from each Request
                .collect(Collectors.toList());
    }
    public List<LettersModel> getAllRequests() {
        //todo
        return List.of();
    }
}
