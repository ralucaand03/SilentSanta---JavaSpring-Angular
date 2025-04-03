package com.group.silent_santa.controller;

import com.group.silent_santa.model.UsersModel;
import com.group.silent_santa.service.UsersService;
import com.group.silent_santa.view.UsersView;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

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
            // Check if email already exists
            if (usersService.findByEmail(user.getEmail()) != null) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body(Map.of("message", "Email already registered"));
            }

            // Set the role based on the role string from frontend
            if ("HELPER".equalsIgnoreCase(user.getRole().toString())) {
                user.setRole(UsersModel.Role.USER);
            } else if ("GIVER".equalsIgnoreCase(user.getRole().toString())) {
                user.setRole(UsersModel.Role.ADMIN); // Both are users, you can differentiate them in another way if needed
            }

            UsersModel registeredUser = usersService.registerUser(user);
            return ResponseEntity.status(HttpStatus.CREATED).body(registeredUser);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Registration failed: " + e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");

        UsersModel user = usersService.findByEmail(email);

        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Invalid email or password"));
        }

        if (usersService.verifyPassword(password, user.getPassword())) {
            // Don't return the password in the response
            user.setPassword(null);
            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Invalid email or password"));
        }
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
            view.getFrame().dispose(); // Close UsersView window
        }
        // Now safely call openDashboard, because adminDashboardController
        // is injected *after* this bean is created
        adminDashboardController.openDashboard();
    }
}
