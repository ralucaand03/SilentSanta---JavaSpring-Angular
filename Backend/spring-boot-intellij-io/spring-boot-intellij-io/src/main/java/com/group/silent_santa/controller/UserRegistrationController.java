//package com.group.silent_santa.controller;
//
//import com.group.silent_santa.model.UsersModel;
//import com.group.silent_santa.service.CaptchaService;
//import com.group.silent_santa.service.UsersService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.HashMap;
//import java.util.Map;
//
//@RestController
//@RequestMapping("/api/users")
//public class UserRegistrationController {
//
//    private final UsersService usersService;
//    private final CaptchaService captchaService;
//
//    @Autowired
//    public UserRegistrationController(UsersService usersService, CaptchaService captchaService) {
//        this.usersService = usersService;
//        this.captchaService = captchaService;
//    }
//
//    @PostMapping("/signup")
//    public ResponseEntity<?> registerUser(@RequestBody Map<String, Object> registrationData) {
//        // Extract captcha response
//        String captchaResponse = (String) registrationData.get("captchaResponse");
//
//        // Validate captcha
//        if (!captchaService.validateCaptcha(captchaResponse)) {
//            Map<String, String> response = new HashMap<>();
//            response.put("message", "Invalid captcha. Please try again.");
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
//        }
//
//        // Extract user data
//        UsersModel user = new UsersModel();
//        user.setFirstName((String) registrationData.get("firstName"));
//        user.setLastName((String) registrationData.get("lastName"));
//        user.setEmail((String) registrationData.get("email"));
//        user.setPhone((String) registrationData.get("phone"));
//        user.setPassword((String) registrationData.get("password"));
//
//        // Set role
//        String roleStr = (String) registrationData.get("role");
//        UsersModel.Role role = UsersModel.Role.USER; // Default
//        if (roleStr != null && roleStr.equals("ADMIN")) {
//            role = UsersModel.Role.ADMIN;
//        }
//        user.setRole(role);
//
//        // Check if email already exists
//        if (usersService.findByEmail(user.getEmail()) != null) {
//            Map<String, String> response = new HashMap<>();
//            response.put("message", "Email already registered");
//            return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
//        }
//
//        // Register user
//        UsersModel registeredUser = usersService.registerUser(user);
//
//        // Remove password from response
//        registeredUser.setPassword(null);
//
//        return ResponseEntity.status(HttpStatus.CREATED).body(registeredUser);
//    }
//}