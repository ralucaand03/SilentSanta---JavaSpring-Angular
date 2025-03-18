package com.group.silent_santa.service;

import com.group.silent_santa.model.LettersModel;
import com.group.silent_santa.model.UsersModel;
import com.group.silent_santa.repository.LettersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
@Service
@Transactional
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

    public List<String> getWishListByLetterId(UUID letterId) {
        LettersModel letter = lettersRepository.findById(letterId).orElse(null);
        if (letter == null) {
            return List.of();
        }
        // Force the lazy wish list to load while a transaction is still open
        letter.getWishList().size();
        return letter.getWishList();
    }
    public LettersModel addLetter(String title, List<String> wishList, String childName, LettersModel.LetterStatus status, UsersModel postedBy) {
        // Create a new letter with provided details
        LettersModel newLetter = new LettersModel(title, wishList, childName, status, postedBy);

        // Save the letter to the database
        return lettersRepository.save(newLetter);

    }
    public List<LettersModel> getLettersPostedByUser(UsersModel user) {
        // Find all letters posted by the given user
        return lettersRepository.findByPostedBy(user);
    }
}
