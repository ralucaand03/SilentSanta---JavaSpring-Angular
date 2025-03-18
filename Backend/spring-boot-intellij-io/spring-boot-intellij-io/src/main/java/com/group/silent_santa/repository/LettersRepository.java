package com.group.silent_santa.repository;

import com.group.silent_santa.model.LettersModel;
import com.group.silent_santa.model.UsersModel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface LettersRepository extends JpaRepository<LettersModel, UUID> {
    List<LettersModel> findByPostedBy(UsersModel user);
}
