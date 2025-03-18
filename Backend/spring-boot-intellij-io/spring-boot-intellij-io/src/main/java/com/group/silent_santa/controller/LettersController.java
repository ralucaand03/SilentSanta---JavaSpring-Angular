package com.group.silent_santa.controller;

import com.group.silent_santa.model.LettersModel;
import com.group.silent_santa.model.UsersModel;
import com.group.silent_santa.repository.LettersRepository;
import com.group.silent_santa.service.LettersService;
import com.group.silent_santa.service.UsersService;
import com.group.silent_santa.view.LettersView;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import javax.swing.*;
import java.awt.*;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Component
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
        JTextField wishesField = new JTextField();
        JComboBox<String> statusBox = new JComboBox<>(new String[]{"WAITING", "WORKING", "DONE"});

        panel.add(new JLabel("Title:"));
        panel.add(titleField);
        panel.add(new JLabel("Child Name:"));
        panel.add(childNameField);
        panel.add(new JLabel("Wish List (comma-separated):"));
        panel.add(wishesField);
        panel.add(new JLabel("Status:"));
        panel.add(statusBox);

        int result = JOptionPane.showConfirmDialog(null, panel, "Add New Letter",
                JOptionPane.OK_CANCEL_OPTION, JOptionPane.PLAIN_MESSAGE);

        if (result == JOptionPane.OK_OPTION) {
            try {
                String title = titleField.getText().trim();
                String childName = childNameField.getText().trim();
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

                LettersModel letter = new LettersModel(
                        title,
                        wishList,
                        childName,
                        status,
                        currentUser
                );
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
