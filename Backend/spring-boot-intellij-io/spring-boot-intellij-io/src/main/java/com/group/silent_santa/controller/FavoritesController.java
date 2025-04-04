package com.group.silent_santa.controller;

import com.group.silent_santa.model.FavoritesModel;
import com.group.silent_santa.model.LettersModel;
import com.group.silent_santa.service.FavoritesService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/favorites")
@CrossOrigin(origins = "http://localhost:4200")
public class FavoritesController {
    private final FavoritesService favoritesService;

    public FavoritesController(FavoritesService favoritesService) {
        this.favoritesService = favoritesService;
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<LettersModel>> getUserFavorites(@PathVariable UUID userId) {
        List<LettersModel> favorites = favoritesService.getAllFavorites(userId);
        return ResponseEntity.ok(favorites);
    }

    @PostMapping("/user/{userId}/letter/{letterId}")
    public ResponseEntity<FavoritesModel> addFavorite(
            @PathVariable UUID userId,
            @PathVariable UUID letterId) {
        FavoritesModel favorite = favoritesService.addFavorite(userId, letterId);
        return ResponseEntity.status(HttpStatus.CREATED).body(favorite);
    }

    @DeleteMapping("/user/{userId}/letter/{letterId}")
    public ResponseEntity<Map<String, String>> removeFavorite(
            @PathVariable UUID userId,
            @PathVariable UUID letterId) {
        favoritesService.removeFavorite(userId, letterId);
        return ResponseEntity.ok(Map.of("message", "Favorite removed successfully"));
    }

    @GetMapping("/user/{userId}/letter/{letterId}")
    public ResponseEntity<Map<String, Boolean>> checkFavorite(
            @PathVariable UUID userId,
            @PathVariable UUID letterId) {
        boolean isFavorite = favoritesService.isFavorite(userId, letterId);
        return ResponseEntity.ok(Map.of("isFavorite", isFavorite));
    }
}

