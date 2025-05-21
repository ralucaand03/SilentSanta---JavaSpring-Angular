package com.group.silent_santa.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "users")
public class UsersModel implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @NotBlank(message = "First name is required")
    private String firstName;

    @NotBlank(message = "Last name is required")
    private String lastName;

    @Email(message = "Email should be valid")
    @NotBlank(message = "Email is required")
    @Column(unique = true)
    private String email;

    @NotBlank(message = "Phone number is required")
    private String phone;

    @NotBlank(message = "Password is required")
    private String password;

    @Enumerated(EnumType.STRING)
    private Role role = Role.USER; // Default role

    private LocalDateTime createdAt;


    public enum Role {
        USER, ADMIN
    }

    public UsersModel(String firstName, String lastName, String email, String phone, String password, Role role) {
        this.id = UUID.randomUUID();
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.phone = phone;
        this.password = password; // hash before setting!
        this.role = role;
        this.createdAt = LocalDateTime.now();
    }

    @PrePersist
    public void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
    @Override
    public Collection<SimpleGrantedAuthority> getAuthorities() {
        // This can be customized based on your roles
        return Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }

    @Override
    public String getPassword() {
        return this.password;
    }

    @Override
    public String getUsername() {
        return this.email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;  // or implement the logic based on your requirements
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;  // or implement the logic based on your requirements
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;  // or implement the logic based on your requirements
    }

    @Override
    public boolean isEnabled() {
        return true;  // or implement the logic based on your requirements
    }

}
