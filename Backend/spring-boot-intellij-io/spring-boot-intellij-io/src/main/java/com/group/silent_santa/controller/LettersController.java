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

import javax.swing.*;
import java.awt.*;
import java.util.List;

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
        view.populateLetters(letters != null ? letters : List.of());
    }

    public void onViewLetter(int rowIndex) {
        LettersModel selectedLetter = view.getLetterAt(rowIndex);
        if (selectedLetter != null) {
            JOptionPane.showMessageDialog(null,
                    "📜 Viewing letter for child: " + selectedLetter.getChildName(),
                    "Letter Info",
                    JOptionPane.INFORMATION_MESSAGE);
        } else {
            JOptionPane.showMessageDialog(null,
                    "⚠ No letter found at index: " + rowIndex,
                    "Error",
                    JOptionPane.WARNING_MESSAGE);
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
        JTextField wishesField = new JTextField();
        JComboBox<String> statusBox = new JComboBox<>(new String[]{"ACTIVE", "INACTIVE"});

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
                List<String> wishList = List.of(wishesField.getText().split(","));
                LettersModel.LetterStatus status =
                        LettersModel.LetterStatus.valueOf(statusBox.getSelectedItem().toString());

                UsersModel adminUser = usersService.getAdminUser();
                if (adminUser == null) {
                    JOptionPane.showMessageDialog(null,
                            "⚠ No admin user found to assign as poster.");
                    return;
                }

                LettersModel letter = new LettersModel(
                        title,
                        wishList,
                        childName,
                        status,
                        adminUser
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
