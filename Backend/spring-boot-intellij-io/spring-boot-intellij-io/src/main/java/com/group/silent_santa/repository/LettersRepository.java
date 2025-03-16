package com.group.silent_santa.repository;

import com.group.silent_santa.model.LettersModel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface LettersRepository extends JpaRepository<LettersModel, UUID> {
}
