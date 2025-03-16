package com.group.silent_santa.controller;

import com.group.silent_santa.model.UsersModel;
import com.group.silent_santa.model.UsersModel.Role;
import com.group.silent_santa.service.UsersService;
import com.group.silent_santa.view.LogInView;
import com.group.silent_santa.view.SignUpView;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validator;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.stereotype.Component;

import javax.swing.*;
import java.sql.SQLException;
import java.util.Set;

@Component
@RequiredArgsConstructor // For usersService + validator
public class SignUpController {

    private final UsersService usersService;
    private final Validator validator;

    @Setter
    private SignUpView view; // So we can close it / read fields

    /**
     * No longer keeps a LogInController field.
     * We just pass it in at call-time to avoid circular references.
     */
    public void signupButtonClicked(LogInController logInController) throws SQLException {
        UsersModel user = new UsersModel();
        user.setFirstName(view.getFirstNameField().getText().trim());
        user.setLastName(view.getLastNameField().getText().trim());
        user.setEmail(view.getEmailField().getText().trim());
        user.setPhone(view.getPhoneField().getText().trim());

        String rawPassword = new String(view.getPasswordField().getPassword()).trim();
        user.setPassword(rawPassword);
        user.setRole(view.getAdminCheckBox().isSelected() ? Role.ADMIN : Role.USER);

        // Validate
        Set<ConstraintViolation<UsersModel>> violations = validator.validate(user);
        if (!violations.isEmpty()) {
            StringBuilder errorMessage = new StringBuilder("❌ Validation Errors:\n");
            for (ConstraintViolation<UsersModel> v : violations) {
                errorMessage.append("- ").append(v.getMessage()).append("\n");
            }
            JOptionPane.showMessageDialog(null, errorMessage.toString(),
                    "Validation Error",
                    JOptionPane.WARNING_MESSAGE);
            return;
        }

        if (usersService.findByEmail(user.getEmail()) != null) {
            JOptionPane.showMessageDialog(null, "⚠ A user with this email already exists!");
            return;
        }

        // Hash password before saving
        user.setPassword(usersService.encodePassword(rawPassword));
        usersService.registerUser(user);

        JOptionPane.showMessageDialog(null, "✅ Account created successfully!");

        // Go back to the login window
        LogInView logInView = new LogInView(logInController);
        logInController.setView(logInView);
        view.getFrame().dispose();
    }
}
