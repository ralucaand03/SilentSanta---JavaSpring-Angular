package com.group.silent_santa.service;

import com.group.silent_santa.model.LettersModel;
import com.group.silent_santa.repository.LettersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class LettersService {

    private final LettersRepository lettersRepository;

    @Autowired
    public LettersService(LettersRepository lettersRepository) {
        this.lettersRepository = lettersRepository;
    }

    public List<LettersModel> getAllLetters() {
        return lettersRepository.findAll();
    }

    public LettersModel getLetterById(UUID id) {
        return lettersRepository.findById(id).orElse(null);
    }

    public LettersModel saveLetter(LettersModel letter) {
        return lettersRepository.save(letter);
    }

    public boolean deleteLetter(UUID id) {
        if (lettersRepository.existsById(id)) {
            lettersRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
