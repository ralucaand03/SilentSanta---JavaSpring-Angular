package com.group.silent_santa.repository;

import com.group.silent_santa.model.FavoritesModel;
import com.group.silent_santa.model.LettersModel;
import com.group.silent_santa.model.UsersModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface FavoritesRepository extends JpaRepository<FavoritesModel, UUID> {
    // Find all favorites by user ID
    List<FavoritesModel> findByUserId(UUID userId);

    // Find favorite letters for a user
    @Query("SELECT f.letter FROM FavoritesModel f WHERE f.user.id = :userId")
    List<LettersModel> findFavoriteLettersByUserId(@Param("userId") UUID userId);

    // Find a specific favorite by user and letter
    Optional<FavoritesModel> findByUserIdAndLetterId(UUID userId, UUID letterId);

    // Check if a letter is favorited by a user
    boolean existsByUserIdAndLetterId(UUID userId, UUID letterId);
}
