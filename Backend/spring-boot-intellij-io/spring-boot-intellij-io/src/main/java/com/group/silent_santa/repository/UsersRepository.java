package com.group.silent_santa.repository;

import com.group.silent_santa.model.UsersModel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface UsersRepository extends JpaRepository<UsersModel, UUID> {

    Optional<UsersModel> findByEmail(String email);

}
