package com.vinsuite.controller;

import com.vinsuite.model.User;
import com.vinsuite.repository.UserRepository;
import com.vinsuite.request.LoginRequest;
import com.vinsuite.request.RegisterRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.sql.Timestamp;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public User register(@RequestBody RegisterRequest registerRequest) {
        if (userRepository.findByEmail(registerRequest.getEmail()) != null) {
            throw new RuntimeException("User already exists");
        }

        User user = new User();
        user.setEmail(registerRequest.getEmail());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setRole(registerRequest.getRole());
        user.setName(registerRequest.getName()); // ✅ name
        user.setCreatedAt(new Timestamp(System.currentTimeMillis())); // ✅ created_at

        return userRepository.save(user);
    }

    @PostMapping("/login")
    public User login(@RequestBody LoginRequest loginRequest) {
        System.out.println("Attempting login for email: " + loginRequest.getEmail());

        User user = userRepository.findByEmail(loginRequest.getEmail());
        if (user == null) {
            throw new RuntimeException("User not found");
        }

        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        return user;
    }
}
