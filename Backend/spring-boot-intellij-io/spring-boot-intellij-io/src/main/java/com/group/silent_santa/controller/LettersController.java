package com.group.silent_santa.controller;

import com.group.silent_santa.model.LettersModel;
import com.group.silent_santa.model.UsersModel;
import com.group.silent_santa.repository.LettersRepository;
import com.group.silent_santa.service.LettersService;
import com.group.silent_santa.service.UsersService;
import com.group.silent_santa.view.LettersView;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;

import javax.swing.*;
import java.awt.*;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import java.util.Map;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/letters")        // <-- the base path for all "letters" endpoints
@CrossOrigin(origins = "http://localhost:4200") // <-- so Angular can call this from port 4200
public class LettersController {

    private final LettersRepository lettersRepository;
    private final UsersService usersService;
    private final LettersService lettersService;

    // Use setter injection for AdminDashboardController to break the cycle:
    private ObjectProvider<AdminDashboardController> adminDashboardControllerProvider;

    private LettersView view;

    // Constructor injection for your *other* required beans:
    @Autowired
    public LettersController(LettersRepository lettersRepository,
                             UsersService usersService,
                             LettersService lettersService) {
        this.lettersRepository = lettersRepository;
        this.usersService = usersService;
        this.lettersService = lettersService;
    }

    // Spring calls this *after* LettersController is constructed
    @Autowired
    public void setAdminDashboardControllerProvider(ObjectProvider<AdminDashboardController> provider) {
        this.adminDashboardControllerProvider = provider;
    }
    //-------------------------------------------------------------------added
    @GetMapping
    public List<LettersModel> getAllLetters() {
        // This will automatically convert the List<LettersModel> to JSON
        return lettersService.getAllLetters();
    }


    @GetMapping("/{id}")
    public LettersModel getLetterById(@PathVariable UUID id) {
        return lettersService.getLetterById(id);
    }

    @PostMapping
    public LettersModel createLetter(@RequestBody LettersModel newLetter) {
        return lettersService.saveLetter(newLetter);
    }

    @PostMapping("/create")
    public ResponseEntity<?> createLetterWithDetails(@RequestBody LetterCreationDTO letterDTO) {
        try {
            UsersModel currentUser = usersService.getCurrentUser();
            if (currentUser == null) {
                return ResponseEntity.badRequest().body("No authenticated user found");
            }

            LettersModel newLetter = lettersService.addLetterWithDetails(
                    letterDTO.getTitle(),
                    letterDTO.getWishList(),
                    letterDTO.getChildName(),
                    letterDTO.getChildAge(),
                    letterDTO.getGender(),
                    letterDTO.getLocation(),
                    letterDTO.getImagePath(),
                    LettersModel.LetterStatus.valueOf(letterDTO.getStatus()),
                    currentUser
            );

            return ResponseEntity.ok(newLetter);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error creating letter: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public boolean deleteLetter(@PathVariable UUID id) {
        return lettersService.deleteLetter(id);
    }

    // New endpoints to match Angular service

    @PutMapping("/{id}")
    public ResponseEntity<LettersModel> updateLetter(@PathVariable UUID id, @RequestBody LettersModel letter) {
        if (!id.equals(letter.getId())) {
            return ResponseEntity.badRequest().build();
        }

        LettersModel existingLetter = lettersService.getLetterById(id);
        if (existingLetter == null) {
            return ResponseEntity.notFound().build();
        }

        // Update the existing letter with new values
        existingLetter.setTitle(letter.getTitle());
        existingLetter.setChildName(letter.getChildName());
        existingLetter.setChildAge(letter.getChildAge());
        existingLetter.setGender(letter.getGender());
        existingLetter.setLocation(letter.getLocation());
        existingLetter.setImagePath(letter.getImagePath());
        existingLetter.setStatus(letter.getStatus());
        existingLetter.setWishList(letter.getWishList());

        LettersModel updatedLetter = lettersService.saveLetter(existingLetter);
        return ResponseEntity.ok(updatedLetter);
    }

    @PatchMapping("/{id}/favorite")
    public ResponseEntity<LettersModel> toggleFavorite(@PathVariable UUID id, @RequestBody Map<String, Boolean> payload) {
        LettersModel letter = lettersService.getLetterById(id);
        if (letter == null) {
            return ResponseEntity.notFound().build();
        }

        Boolean isFavorite = payload.get("isFavorite");
        if (isFavorite != null) {
            letter.setIsFavorite(isFavorite);
            LettersModel updatedLetter = lettersService.saveLetter(letter);
            return ResponseEntity.ok(updatedLetter);
        } else {
            return ResponseEntity.badRequest().build();
        }
    }

    @PatchMapping("/{id}/request")
    public ResponseEntity<LettersModel> requestLetter(@PathVariable UUID id) {
        LettersModel letter = lettersService.getLetterById(id);
        if (letter == null) {
            return ResponseEntity.notFound().build();
        }

        letter.setIsRequested(true);
        LettersModel updatedLetter = lettersService.saveLetter(letter);
        return ResponseEntity.ok(updatedLetter);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<LettersModel> changeStatus(@PathVariable UUID id, @RequestBody Map<String, String> payload) {
        LettersModel letter = lettersService.getLetterById(id);
        if (letter == null) {
            return ResponseEntity.notFound().build();
        }

        String status = payload.get("status");
        if (status != null) {
            try {
                letter.setStatus(LettersModel.LetterStatus.valueOf(status));
                LettersModel updatedLetter = lettersService.saveLetter(letter);
                return ResponseEntity.ok(updatedLetter);
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest().build();
            }
        } else {
            return ResponseEntity.badRequest().build();
        }
    }

    //-------------------------------------------------------------------Swing
    public static class LetterCreationDTO {
        private String title;
        private List<String> wishList;
        private String childName;
        private Integer childAge;
        private String gender;
        private String location;
        private String imagePath;
        private String status = "WAITING";

        // Getters and setters
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }

        public List<String> getWishList() { return wishList; }
        public void setWishList(List<String> wishList) { this.wishList = wishList; }

        public String getChildName() { return childName; }
        public void setChildName(String childName) { this.childName = childName; }

        public Integer getChildAge() { return childAge; }
        public void setChildAge(Integer childAge) { this.childAge = childAge; }

        public String getGender() { return gender; }
        public void setGender(String gender) { this.gender = gender; }

        public String getLocation() { return location; }
        public void setLocation(String location) { this.location = location; }

        public String getImagePath() { return imagePath; }
        public void setImagePath(String imagePath) { this.imagePath = imagePath; }

        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
    }

    public void loadLetters(LettersView view) {
        this.view = view;
        List<LettersModel> letters = lettersRepository.findAll();
        System.out.println("Loaded letters: " + letters.size()); // Debugging statement
        view.populateLetters(letters != null ? letters : List.of());
    }

    public void onViewLetter(int rowIndex) {
        if (rowIndex >= 0 && rowIndex < view.getLetters().size()) { // Validate the index
            LettersModel selectedLetter = view.getLetterAt(rowIndex);
            if (selectedLetter != null) {
                // 1) Fetch the wish list by letter ID
                List<String> wishList = lettersService.getWishListByLetterId(selectedLetter.getId());

                if (!wishList.isEmpty()) {
                    // 2) Build a small panel listing each wish item
                    JPanel panel = new JPanel(new GridLayout(0, 1, 5, 5));
                    panel.setBorder(BorderFactory.createEmptyBorder(10, 10, 10, 10));

                    panel.add(new JLabel("Child Name: " + selectedLetter.getChildName()));
                    panel.add(new JLabel("Title: " + selectedLetter.getTitle()));
                    panel.add(new JLabel("Wish List Items:"));

                    for (String item : wishList) {
                        panel.add(new JLabel("• " + item));
                    }

                    // 3) Add buttons (edit, delete, request) based on user role
                    UsersModel currentUser = usersService.getCurrentUser();

                    if (currentUser != null) {
                        if (currentUser.getRole().equals(UsersModel.Role.ADMIN)) {
                            JButton editButton = new JButton("Edit");
                            JButton deleteButton = new JButton("Delete");

                            editButton.addActionListener(e -> onEditLetter(selectedLetter));
                            deleteButton.addActionListener(e -> onDeleteLetter(selectedLetter.getId()));

                            panel.add(editButton);
                            panel.add(deleteButton);
                        } else if (currentUser.getRole().equals(UsersModel.Role.USER)) {
                            JButton requestButton = new JButton("Request Letter");

                            requestButton.addActionListener(e -> onRequestLetter(selectedLetter));

                            panel.add(requestButton);
                        }
                    } else {
                        JOptionPane.showMessageDialog(null,
                                "⚠ No authenticated user found. Please log in.",
                                "Error",
                                JOptionPane.WARNING_MESSAGE);
                    }

                    JOptionPane.showMessageDialog(null, panel, "Letter Wish List", JOptionPane.INFORMATION_MESSAGE);
                } else {
                    JOptionPane.showMessageDialog(null,
                            "No wish items found for this letter.",
                            "No Items",
                            JOptionPane.WARNING_MESSAGE);
                }
            }
        } else {
            JOptionPane.showMessageDialog(null,
                    "⚠ No letter found at index: " + rowIndex,
                    "Error",
                    JOptionPane.WARNING_MESSAGE);
        }
    }

    @Transactional
    public void onEditLetter(LettersModel selectedLetter) {
        // Create the panel for editing letter details
        JPanel panel = new JPanel(new GridLayout(0, 2, 10, 10));

        // Create the text fields for each editable property
        JTextField titleField = new JTextField(selectedLetter.getTitle());
        JTextField childNameField = new JTextField(selectedLetter.getChildName());
        JTextField wishListField = new JTextField(String.join(",", selectedLetter.getWishList())); // Convert wish list to a comma-separated string
        JComboBox<String> statusBox = new JComboBox<>(new String[]{"WAITING", "WORKING", "DONE"});
        statusBox.setSelectedItem(selectedLetter.getStatus().name());  // Set current status in combo box

        // Add fields to the panel
        panel.add(new JLabel("Title:"));
        panel.add(titleField);
        panel.add(new JLabel("Child Name:"));
        panel.add(childNameField);
        panel.add(new JLabel("Wish List (comma-separated):"));
        panel.add(wishListField);
        panel.add(new JLabel("Status:"));
        panel.add(statusBox);

        // Create and add the Save button
        JButton saveButton = new JButton("Save Changes");

        saveButton.addActionListener(e -> {
            try {
                // Get values from the fields
                String newTitle = titleField.getText().trim();
                String newChildName = childNameField.getText().trim();
                List<String> newWishList = Arrays.stream(wishListField.getText().split(","))
                        .map(String::trim)
                        .filter(s -> !s.isEmpty()) // Filter out empty items
                        .toList();
                LettersModel.LetterStatus newStatus = LettersModel.LetterStatus.valueOf(statusBox.getSelectedItem().toString());

                // Update the selectedLetter object
                selectedLetter.setTitle(newTitle);
                selectedLetter.setChildName(newChildName);
                selectedLetter.setWishList(newWishList);
                selectedLetter.setStatus(newStatus);

                // Save the updated letter to the database
                lettersService.saveLetter(selectedLetter);
                JOptionPane.showMessageDialog(null, "✅ Letter updated!");

                // Reload the letters list
                loadLetters(view);
            } catch (Exception ex) {
                ex.printStackTrace();
                JOptionPane.showMessageDialog(null,
                        "❌ Error updating letter: " + ex.getMessage());
            }
        });

        // Add Save button to panel
        panel.add(saveButton);

        // Show the panel in a message dialog
        JOptionPane.showMessageDialog(
                null,
                panel,
                "Edit Letter",
                JOptionPane.INFORMATION_MESSAGE
        );
    }

    private void onDeleteLetter(UUID id) {
        // Show a confirmation dialog for deletion
        int confirm = JOptionPane.showConfirmDialog(null,
                "Are you sure you want to delete this letter?",
                "Delete Confirmation",
                JOptionPane.YES_NO_OPTION);

        if (confirm == JOptionPane.YES_OPTION) {
            try {
                // Delete the letter from the database using the service
                lettersService.deleteLetter(id);

                // After the deletion, refresh the table to show the updated list

                // Optionally, show a success message
                JOptionPane.showMessageDialog(null,
                        "✅ Letter deleted successfully!");
                if (view != null) {
                    view.getFrame().dispose(); // Close the current window
                }
                LettersView lettersView = new LettersView(this);
                this.loadLetters(lettersView);

            } catch (Exception ex) {
                ex.printStackTrace();
                JOptionPane.showMessageDialog(null,
                        "❌ Error deleting letter: " + ex.getMessage());
            }
        }
    }


    private void onRequestLetter(LettersModel selectedLetter) {
        // Implement the request letter functionality for the Swing UI
        try {
            selectedLetter.setIsRequested(true);
            lettersService.saveLetter(selectedLetter);
            JOptionPane.showMessageDialog(null, "✅ Letter requested successfully!");
            loadLetters(view);
        } catch (Exception ex) {
            ex.printStackTrace();
            JOptionPane.showMessageDialog(null,
                    "❌ Error requesting letter: " + ex.getMessage());
        }
    }

    public void back() {
        if (view != null) {
            view.getFrame().dispose();
        }
        // Now fetch the AdminDashboardController *after* bean creation
        adminDashboardControllerProvider.getObject().openDashboard();
    }

    public void addLetter(LettersView lettersView) {
        JPanel panel = new JPanel(new GridLayout(0, 2, 10, 10));
        JTextField titleField = new JTextField();
        JTextField childNameField = new JTextField();
        JTextField childAgeField = new JTextField();
        JComboBox<String> genderBox = new JComboBox<>(new String[]{"boy", "girl"});
        JTextField locationField = new JTextField();
        JTextField wishesField = new JTextField();
        JTextField imagePathField = new JTextField();
        JComboBox<String> statusBox = new JComboBox<>(new String[]{"WAITING", "WORKING", "DONE"});

        panel.add(new JLabel("Title:"));
        panel.add(titleField);
        panel.add(new JLabel("Child Name:"));
        panel.add(childNameField);
        panel.add(new JLabel("Child Age:"));
        panel.add(childAgeField);
        panel.add(new JLabel("Gender:"));
        panel.add(genderBox);
        panel.add(new JLabel("School/Location:"));
        panel.add(locationField);
        panel.add(new JLabel("Wish List (comma-separated):"));
        panel.add(wishesField);
        panel.add(new JLabel("Image Path (optional):"));
        panel.add(imagePathField);
        panel.add(new JLabel("Status:"));
        panel.add(statusBox);

        int result = JOptionPane.showConfirmDialog(null, panel, "Add New Letter",
                JOptionPane.OK_CANCEL_OPTION, JOptionPane.PLAIN_MESSAGE);

        if (result == JOptionPane.OK_OPTION) {
            try {
                String title = titleField.getText().trim();
                String childName = childNameField.getText().trim();

                // Parse child age
                Integer childAge = null;
                if (!childAgeField.getText().trim().isEmpty()) {
                    try {
                        childAge = Integer.parseInt(childAgeField.getText().trim());
                    } catch (NumberFormatException e) {
                        JOptionPane.showMessageDialog(null,
                                "⚠ Invalid age format. Please enter a number.",
                                "Error",
                                JOptionPane.WARNING_MESSAGE);
                        return;
                    }
                }

                String gender = (String) genderBox.getSelectedItem();
                String location = locationField.getText().trim();
                String imagePath = imagePathField.getText().trim();

                // Process wish list: split by comma, trim each item, and filter out empty strings.
                List<String> wishList = Arrays.stream(wishesField.getText().split(","))
                        .map(String::trim)
                        .filter(s -> !s.isEmpty())
                        .toList();

                LettersModel.LetterStatus status =
                        LettersModel.LetterStatus.valueOf(statusBox.getSelectedItem().toString());

                UsersModel currentUser = usersService.getCurrentUser();
                if (currentUser == null) {
                    JOptionPane.showMessageDialog(null,
                            "⚠ No authenticated user found. Please log in.",
                            "Error",
                            JOptionPane.WARNING_MESSAGE);
                    return;
                }

                // Create a new letter with all the fields
                LettersModel letter = new LettersModel(
                        title,
                        wishList,
                        childName,
                        childAge,
                        gender,
                        location,
                        imagePath,
                        status,
                        currentUser
                );

                // Set default values for isFavorite and isRequested
                letter.setIsFavorite(false);
                letter.setIsRequested(false);

                lettersService.saveLetter(letter);
                JOptionPane.showMessageDialog(null, "✅ Letter added!");
                loadLetters(lettersView);
            } catch (Exception e) {
                e.printStackTrace();
                JOptionPane.showMessageDialog(null,
                        "❌ Error saving letter: " + e.getMessage());
            }
        }
    }
}
