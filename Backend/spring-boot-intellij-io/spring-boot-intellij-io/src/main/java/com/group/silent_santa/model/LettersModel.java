package com.group.silent_santa.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = "postedBy")
@Entity
@Table(name = "letters")
public class LettersModel {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @NotBlank(message = "Title is required")
    private String title;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "letter_wish_list", joinColumns = @JoinColumn(name = "letter_id"))
    @Column(name = "wish_item")
    @NotNull(message = "Wish list must not be null")
    private List<String> wishList;

    @NotBlank(message = "Child name is required")
    private String childName;

    // New fields
    private Integer childAge;

    private String gender;

    private String location;

    private Boolean isFavorite = false;

    private Boolean isRequested = false;

    private String imagePath;
    // End of new fields

    @Enumerated(EnumType.STRING)
    @NotNull(message = "Status is required")
    private LetterStatus status = LetterStatus.WAITING;

    private LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "posted_by", nullable = false)
    @NotNull(message = "Letter must be linked to a user")
    private UsersModel postedBy;

    public enum LetterStatus {
        WAITING, WORKING, DONE
    }

    // Update the constructor to include new fields
    public LettersModel(String title, List<String> wishList, String childName,
                        Integer childAge, String gender, String location,
                        String imagePath, LetterStatus status, UsersModel postedBy) {
        this.title = title;
        this.wishList = wishList;
        this.childName = childName;
        this.childAge = childAge;
        this.gender = gender;
        this.location = location;
        this.imagePath = imagePath;
        this.isFavorite = false;
        this.isRequested = false;
        this.status = status != null ? status : LetterStatus.WAITING;
        this.postedBy = postedBy;
        this.createdAt = LocalDateTime.now();
    }

    // Keep the old constructor for backward compatibility
    public LettersModel(String title, List<String> wishList, String childName, LetterStatus status, UsersModel postedBy) {
        this.title = title;
        this.wishList = wishList;
        this.childName = childName;
        this.status = status != null ? status : LetterStatus.WAITING;
        this.postedBy = postedBy;
        this.createdAt = LocalDateTime.now();
    }

    @PrePersist
    public void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}