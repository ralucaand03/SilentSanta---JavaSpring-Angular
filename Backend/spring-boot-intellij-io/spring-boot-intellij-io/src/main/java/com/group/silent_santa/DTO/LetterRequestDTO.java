package com.group.silent_santa.DTO;

import com.group.silent_santa.model.LettersModel;
import com.group.silent_santa.model.RequestsModel;
import com.group.silent_santa.model.UsersModel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LetterRequestDTO {
    private UUID requestId;
    private LettersModel letter;
    private UsersModel requester;
    private String status;

    public static LetterRequestDTO fromRequestModel(RequestsModel request) {
        LetterRequestDTO dto = new LetterRequestDTO();
        dto.setRequestId(request.getId());
        dto.setLetter(request.getLetter());
        dto.setRequester(request.getUser());
        dto.setStatus(request.getStatus().toString());
        return dto;
    }
}