package com.vinsuite.controller;

import com.vinsuite.dto.common.LoginRequest;
import com.vinsuite.dto.common.RegisterRequest;
import com.vinsuite.model.User;
import com.vinsuite.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.sql.Timestamp;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    // 🔐 Pre-generated BCrypt hash for "Admin@123"
    private static final String ADMIN_HASHED_PASSWORD = "$2b$12$lJKSV5Ou2d65bbLbWILwYO3zvd9.Ml6SDz/.PP8nyWm0cEiGQq2Uu";

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest registerRequest) {
        if ("admin".equalsIgnoreCase(registerRequest.getRole())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("message", "Admin registration is not allowed"));
        }

        if (userRepository.findByEmail(registerRequest.getEmail()) != null) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("message", "User already exists"));
        }

        User user = new User();
        user.setEmail(registerRequest.getEmail());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setRole(registerRequest.getRole());
        user.setName(registerRequest.getName());
        user.setCreatedAt(new Timestamp(System.currentTimeMillis()));

        return ResponseEntity.ok(userRepository.save(user));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        // ✅ Hardcoded admin login
        if ("admin@vinsuite.ai".equalsIgnoreCase(loginRequest.getEmail()) &&
            passwordEncoder.matches(loginRequest.getPassword(), ADMIN_HASHED_PASSWORD)) {

            User adminUser = new User();
            adminUser.setId(0L); // dummy ID
            adminUser.setEmail("admin@vinsuite.ai");
            adminUser.setName("Admin User");
            adminUser.setRole("admin");
            return ResponseEntity.ok(adminUser);
        }

        // 🔐 Normal user login
        User user = userRepository.findByEmail(loginRequest.getEmail());

        if (user == null || !passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Invalid email or password"));
        }

        return ResponseEntity.ok(user);
    }
}
