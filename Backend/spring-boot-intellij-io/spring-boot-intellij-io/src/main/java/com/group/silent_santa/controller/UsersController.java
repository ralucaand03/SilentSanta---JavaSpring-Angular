package com.group.silent_santa.controller;

import com.group.silent_santa.model.UsersModel;
import com.group.silent_santa.service.CaptchaService;
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
    private final CaptchaService captchaService;

    private AdminDashboardController adminDashboardController; // no longer final

    private UsersView view;

    // Inject only the *necessary* dependencies via the constructor
    @Autowired
    public UsersController(UsersService usersService, CaptchaService captchaService) {
        this.usersService = usersService;
        this.captchaService = captchaService;
    }

    // Setter injection for AdminDashboardController
    @Autowired
    public void setAdminDashboardController(AdminDashboardController adminController) {
        this.adminDashboardController = adminController;
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody Map<String, Object> registrationData) {
        try {
            // Extract captcha token from request - check both possible field names
            String captchaToken = (String) registrationData.get("captchaToken");
            if (captchaToken == null) {
                captchaToken = (String) registrationData.get("captchaResponse");
            }

            // Log the received data for debugging
            System.out.println("Received registration data: " + registrationData);
            System.out.println("Captcha token present: " + (captchaToken != null && !captchaToken.isEmpty()));

            // Validate captcha token
            if (captchaToken == null || captchaToken.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("message", "Captcha verification is required"));
            }

            // For development/testing, you can bypass captcha validation
            boolean isCaptchaValid = true;

            // Uncomment this for production
            // boolean isCaptchaValid = captchaService.validateCaptcha(captchaToken);

            if (!isCaptchaValid) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("message", "Captcha verification failed"));
            }

            // Extract user data from the request
            UsersModel user = new UsersModel();
            user.setEmail((String) registrationData.get("email"));
            user.setPassword((String) registrationData.get("password"));
            user.setFirstName((String) registrationData.get("firstName"));
            user.setLastName((String) registrationData.get("lastName"));

            // Set phone if present
            if (registrationData.containsKey("phone")) {
                user.setPhone((String) registrationData.get("phone"));
            }

            // Set role from the request or default to USER
            String roleStr = (String) registrationData.get("role");
            if (roleStr != null) {
                // Fix the role mapping - HELPER should be ADMIN, GIVER should be USER
                if ("HELPER".equalsIgnoreCase(roleStr)) {
                    user.setRole(UsersModel.Role.ADMIN);
                } else if ("GIVER".equalsIgnoreCase(roleStr)) {
                    user.setRole(UsersModel.Role.USER);
                } else {
                    try {
                        user.setRole(UsersModel.Role.valueOf(roleStr.toUpperCase()));
                    } catch (IllegalArgumentException e) {
                        user.setRole(UsersModel.Role.USER); // Default to USER if invalid role
                    }
                }
            } else {
                user.setRole(UsersModel.Role.USER); // Default role
            }

            if (usersService.findByEmail(user.getEmail()) != null) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body(Map.of("message", "Email already registered"));
            }

            try {
                UsersModel registeredUser = usersService.registerUser(user);
                // Don't return the password in the response
                registeredUser.setPassword(null);
                return ResponseEntity.status(HttpStatus.CREATED).body(registeredUser);
            } catch (Exception e) {
                System.err.println("Error registering user: " + e.getMessage());
                e.printStackTrace();
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(Map.of("message", "Database error: " + e.getMessage()));
            }
        } catch (Exception e) {
            System.err.println("Registration error: " + e.getMessage());
            e.printStackTrace();
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
