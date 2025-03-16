package com.group.silent_santa.controller;

import com.group.silent_santa.model.UsersModel;
import com.group.silent_santa.service.UsersService;
import com.group.silent_santa.view.LogInView;
import com.group.silent_santa.view.SignUpView;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.swing.*;

@Component
public class LogInController {

    private final UsersService usersService;
    private final AdminDashboardController adminDashboardController;

    // SignUpController is NOT final; we will set it later.
    private SignUpController signUpController;

    // We also keep a reference to the LogInView:
    private LogInView view;

    // Constructor injection for other dependencies (not circular)
    @Autowired
    public LogInController(UsersService usersService,
                           AdminDashboardController adminDashboardController) {
        this.usersService = usersService;
        this.adminDashboardController = adminDashboardController;
    }

    // Setter injection for SignUpController to avoid circular reference
    @Autowired
    public void setSignUpController(SignUpController signUpController) {
        this.signUpController = signUpController;
    }

    // If your code calls `logInController.setView(...)`, we do a simple setter
    public void setView(LogInView view) {
        this.view = view;
    }

    public void loginButtonClicked() {
        String email = view.getEmailField().getText().trim();
        String rawPassword = new String(view.getPasswordField().getPassword()).trim();

        if (email.isEmpty() || rawPassword.isEmpty()) {
            JOptionPane.showMessageDialog(
                    null,
                    "⚠ Email and password are required!",
                    "Validation Error",
                    JOptionPane.WARNING_MESSAGE
            );
            return;
        }

        UsersModel user = usersService.findByEmail(email);
        if (user == null) {
            JOptionPane.showMessageDialog(
                    null,
                    "❌ No account found with this email.",
                    "Login Failed",
                    JOptionPane.ERROR_MESSAGE
            );
            return;
        }

        if (!usersService.verifyPassword(rawPassword, user.getPassword())) {
            JOptionPane.showMessageDialog(
                    null,
                    "❌ Incorrect password.",
                    "Login Failed",
                    JOptionPane.ERROR_MESSAGE
            );
            return;
        }

        JOptionPane.showMessageDialog(
                null,
                "✅ Login successful! Welcome, " + user.getFirstName() + "!"
        );

        // Open Admin Dashboard if user is ADMIN
        if (user.getRole() == UsersModel.Role.ADMIN) {
            adminDashboardController.openDashboard();
            view.getFrame().dispose(); // close login window
        } else {
            JOptionPane.showMessageDialog(null, "👤 Logged in as regular user. No admin access.");
            // or open a user dashboard here
        }
    }

    public void openSignUpView() {
        // Create the sign-up view, linking it to signUpController
        // Then let signUpController also know about its view
        SignUpView signUpView = new SignUpView(signUpController,this);
        signUpController.setView(signUpView);

        // Optionally close the login frame if you want
        // view.getFrame().dispose();
    }
}
