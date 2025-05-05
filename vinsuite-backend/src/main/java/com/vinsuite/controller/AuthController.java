package com.vinsuite.controller;

import com.vinsuite.model.User;
import com.vinsuite.dto.common.RegisterRequest;
import com.vinsuite.dto.common.LoginRequest;
import com.vinsuite.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

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

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());
        user.setDepartment(request.getDepartment());

        userRepository.save(user);
        return ResponseEntity.ok("User registered successfully");
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail());

        if (user == null) {
            return ResponseEntity.status(401).body("Invalid email or password");
        }

        boolean isMatch = passwordEncoder.matches(request.getPassword(), user.getPassword());
        if (!isMatch) {
            return ResponseEntity.status(401).body("Invalid email or password");
        }

        return ResponseEntity.ok(user); // Optionally return token later
    }
}
