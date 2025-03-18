package com.group.silent_santa.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "requests")
public class RequestsModel {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private UsersModel user; // The user who requested the letter

    @ManyToOne
    @JoinColumn(name = "letter_id", nullable = false)
    private LettersModel letter; // The requested letter

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RequestStatus status = RequestStatus.WAITING; // Default status

    public enum RequestStatus {
        ACCEPTED, WAITING, DENIED
    }
}
