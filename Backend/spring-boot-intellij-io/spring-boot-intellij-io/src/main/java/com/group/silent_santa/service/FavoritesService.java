package com.group.silent_santa.service;

import com.group.silent_santa.model.FavoritesModel;
import com.group.silent_santa.model.LettersModel;
import com.group.silent_santa.model.UsersModel;
import com.group.silent_santa.repository.FavoritesRepository;
import com.group.silent_santa.repository.LettersRepository;
import com.group.silent_santa.repository.UsersRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@Service
public class FavoritesService {
    private final FavoritesRepository favoritesRepository;
    private final UsersRepository usersRepository;
    private final LettersRepository lettersRepository;

    public FavoritesService(FavoritesRepository favoritesRepository,
                            UsersRepository usersRepository,
                            LettersRepository lettersRepository) {
        this.favoritesRepository = favoritesRepository;
        this.usersRepository = usersRepository;
        this.lettersRepository = lettersRepository;
    }


    public List<LettersModel> getAllFavorites(UUID userId) {
        return favoritesRepository.findFavoriteLettersByUserId(userId);
    }


    public FavoritesModel addFavorite(UUID userId, UUID letterId) {
        // Check if already favorited
        if (favoritesRepository.existsByUserIdAndLetterId(userId, letterId)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Letter is already in favorites");
        }

        // Get user and letter
        UsersModel user = usersRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        LettersModel letter = lettersRepository.findById(letterId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Letter not found"));

        // Create and save favorite
        FavoritesModel favorite = new FavoritesModel();
        favorite.setUser(user);
        favorite.setLetter(letter);

        return favoritesRepository.save(favorite);
    }


    public void removeFavorite(UUID userId, UUID letterId) {
        FavoritesModel favorite = favoritesRepository.findByUserIdAndLetterId(userId, letterId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Favorite not found"));

        favoritesRepository.delete(favorite);
    }


    public boolean isFavorite(UUID userId, UUID letterId) {
        return favoritesRepository.existsByUserIdAndLetterId(userId, letterId);
    }
}

