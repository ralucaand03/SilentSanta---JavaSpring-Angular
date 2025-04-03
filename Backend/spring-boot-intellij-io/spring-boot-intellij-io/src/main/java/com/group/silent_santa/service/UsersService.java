package com.group.silent_santa.service;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import com.group.silent_santa.model.UsersModel;
import com.group.silent_santa.repository.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

@Service
public class UsersService {

    private final UsersRepository usersRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder(); // ✅ define this

    @Autowired
    public UsersService(UsersRepository usersRepository) {
        this.usersRepository = usersRepository;
    }

    public UsersModel registerUser(UsersModel user) {
        // ✅ Hash the password before saving
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return usersRepository.save(user);
    }

    public List<UsersModel> getAllUsers() {
        return usersRepository.findAll();
    }

    public boolean deleteUser(UUID id) {
        Optional<UsersModel> user = usersRepository.findById(id);
        if (user.isPresent()) {
            usersRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public UsersModel findByEmail(String email) {
        Optional<UsersModel> optionalUser = usersRepository.findByEmail(email);
        return optionalUser.orElse(null);
    }

    public boolean verifyPassword(String rawPassword, String hashedPassword) {
        return passwordEncoder.matches(rawPassword, hashedPassword);
    }
    public String encodePassword(String rawPassword) {
        return passwordEncoder.encode(rawPassword);
    }
    public UsersModel getAdminUser() {
        return usersRepository.findAll().stream()
                .filter(user -> user.getRole() == UsersModel.Role.ADMIN)
                .findFirst()
                .orElse(null);
    }
    public UsersModel getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof UserDetails) {
            // This assumes your UserDetails object contains the email or unique identifier
            String email = ((UserDetails) auth.getPrincipal()).getUsername();
            return findByEmail(email); // or a dedicated method to fetch your UsersModel
        }
        return null;
    }


}
