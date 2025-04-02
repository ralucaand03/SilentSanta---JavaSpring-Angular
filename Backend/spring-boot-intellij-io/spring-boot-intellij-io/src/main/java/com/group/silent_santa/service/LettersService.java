package com.group.silent_santa.service;

import com.group.silent_santa.model.LettersModel;
import com.group.silent_santa.model.UsersModel;
import com.group.silent_santa.repository.LettersRepository;
import lombok.*;
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

    // Keep the old method for backward compatibility
    public LettersModel addLetter(String title, List<String> wishList, String childName, LettersModel.LetterStatus status, UsersModel postedBy) {
        // Create a new letter with provided details
        LettersModel newLetter = new LettersModel(title, wishList, childName, status, postedBy);

        // Save the letter to the database
        return lettersRepository.save(newLetter);
    }

    // Add a new method that includes all the new fields
    public LettersModel addLetterWithDetails(
            String title,
            List<String> wishList,
            String childName,
            Integer childAge,
            String gender,
            String location,
            String imagePath,
            LettersModel.LetterStatus status,
            UsersModel postedBy) {

        // Create a new letter with all provided details
        LettersModel newLetter = new LettersModel(
                title, wishList, childName, childAge, gender,
                location, imagePath, status, postedBy);

        // Save the letter to the database
        return lettersRepository.save(newLetter);
    }

    public List<LettersModel> getLettersPostedByUser(UsersModel user) {
        // Find all letters posted by the given user
        return lettersRepository.findByPostedBy(user);
    }

    // New methods to support Angular functionality

    public LettersModel toggleFavorite(UUID id, boolean isFavorite) {
        LettersModel letter = getLetterById(id);
        if (letter != null) {
            letter.setIsFavorite(isFavorite);
            return saveLetter(letter);
        }
        return null;
    }

    public LettersModel requestLetter(UUID id) {
        LettersModel letter = getLetterById(id);
        if (letter != null) {
            letter.setIsRequested(true);
            return saveLetter(letter);
        }
        return null;
    }

    public LettersModel changeStatus(UUID id, LettersModel.LetterStatus status) {
        LettersModel letter = getLetterById(id);
        if (letter != null) {
            letter.setStatus(status);
            return saveLetter(letter);
        }
        return null;
    }

    public LettersModel updateLetter(LettersModel updatedLetter) {
        LettersModel existingLetter = getLetterById(updatedLetter.getId());
        if (existingLetter != null) {
            // Update all fields
            existingLetter.setTitle(updatedLetter.getTitle());
            existingLetter.setChildName(updatedLetter.getChildName());
            existingLetter.setChildAge(updatedLetter.getChildAge());
            existingLetter.setGender(updatedLetter.getGender());
            existingLetter.setLocation(updatedLetter.getLocation());
            existingLetter.setImagePath(updatedLetter.getImagePath());
            existingLetter.setStatus(updatedLetter.getStatus());
            existingLetter.setWishList(updatedLetter.getWishList());

            return saveLetter(existingLetter);
        }
        return null;
    }
}

