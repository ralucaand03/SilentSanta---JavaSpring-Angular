package com.group.silent_santa.repository;

import com.group.silent_santa.model.RequestsModel;
import com.group.silent_santa.model.UsersModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface RequestsRepository extends JpaRepository<RequestsModel, UUID> {
    List<RequestsModel> findByUser(UsersModel user);
}
