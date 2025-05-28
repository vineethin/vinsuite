package com.vinsuite.controller;

import com.vinsuite.model.User;
import com.vinsuite.dto.common.RegisterRequest;
import com.vinsuite.dto.common.LoginRequest;
import com.vinsuite.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.status(409).body("Email already registered");
        }

        // ✅ Restrict role to allowed public roles only
        List<String> allowedRoles = List.of("qa", "developer", "analyst");
        if (!allowedRoles.contains(request.getRole().toLowerCase())) {
            return ResponseEntity.status(403).body("Unauthorized role selection");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());
        user.setDepartment(request.getDepartment());

        // ✅ Auto-assign a new tenantId for normal users (treated as a new company)
        user.setTenantId(UUID.randomUUID());

        userRepository.save(user);
        return ResponseEntity.ok("User registered successfully");
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest request) {
        Optional<User> optionalUser = userRepository.findByEmail(request.getEmail());

        if (optionalUser.isEmpty()) {
            return ResponseEntity.status(401).body("Invalid email or password");
        }

        User user = optionalUser.get();
        boolean isMatch = passwordEncoder.matches(request.getPassword(), user.getPassword());

        if (!isMatch) {
            return ResponseEntity.status(401).body("Invalid email or password");
        }

        return ResponseEntity.ok(user); // 🚀 You can return JWT/token + tenant info here
    }
}
