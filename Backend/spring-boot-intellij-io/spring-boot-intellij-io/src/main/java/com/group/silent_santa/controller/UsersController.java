package com.group.silent_santa.controller;

import com.group.silent_santa.model.UsersModel;
import com.group.silent_santa.service.UsersService;
import com.group.silent_santa.view.UsersView;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:4200")
public class UsersController {

    private final UsersService usersService;
    private AdminDashboardController adminDashboardController; // no longer final

    private UsersView view;

    // Inject only the *necessary* dependencies via the constructor
    @Autowired
    public UsersController(UsersService usersService) {
        this.usersService = usersService;
    }

    // Setter injection for AdminDashboardController
    @Autowired
    public void setAdminDashboardController(AdminDashboardController adminController) {
        this.adminDashboardController = adminController;
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody UsersModel user) {
        try {
            if (usersService.findByEmail(user.getEmail()) != null) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body(Map.of("message", "Email already registered"));
            }

            // Fix the role mapping - HELPER should be ADMIN, GIVER should be USER
            if ("HELPER".equalsIgnoreCase(user.getRole().toString())) {
                user.setRole(UsersModel.Role.ADMIN);
            } else if ("GIVER".equalsIgnoreCase(user.getRole().toString())) {
                user.setRole(UsersModel.Role.USER);
            }

            UsersModel registeredUser = usersService.registerUser(user);
            return ResponseEntity.status(HttpStatus.CREATED).body(registeredUser);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Registration failed: " + e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody Map<String, Object> credentials) {
        String email = (String) credentials.get("email");
        String password = (String) credentials.get("password");

        // Add debug logging
        System.out.println("Login attempt for email: " + email);

        UsersModel user = usersService.findByEmail(email);

        if (user == null) {
            System.out.println("User not found with email: " + email);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Invalid email or password"));
        }

        // Add more debug logging
        System.out.println("User found, verifying password");

        if (usersService.verifyPassword(password, user.getPassword())) {
            System.out.println("Password verified successfully");

            // Create a response with JWT token and user info
            Map<String, Object> response = new HashMap<>();

            // Generate a simple token (in a real app, use a proper JWT library)
            String token = generateToken(user);

            response.put("idToken", token);
            response.put("email", user.getEmail());
            response.put("localId", user.getId().toString());
            response.put("role", user.getRole().toString());
            response.put("expiresIn", 3600); // 1 hour in seconds

            // Don't send the password back
            user.setPassword(null);

            return ResponseEntity.ok(response);
        } else {
            System.out.println("Password verification failed");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Invalid email or password"));
        }
    }

    // Simple token generator (for demonstration - use a proper JWT library in production)
    private String generateToken(UsersModel user) {
        // In a real application, use a proper JWT library
        return "token_" + user.getId() + "_" + System.currentTimeMillis();
    }

    @GetMapping("/all")
    public ResponseEntity<List<UsersModel>> getAllUsers() {
        List<UsersModel> users = usersService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    public void loadUsers(UsersView view) {
        this.view = view;
        List<UsersModel> users = usersService.getAllUsers();
        view.populateUsers(users);
    }

    public void back() {
        if (view != null) {
            view.getFrame().dispose();
        }
        adminDashboardController.openDashboard();
    }
}

