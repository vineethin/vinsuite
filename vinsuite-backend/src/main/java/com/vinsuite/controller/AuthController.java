package com.vinsuite.controller;

import com.vinsuite.model.User;
import com.vinsuite.dto.common.RegisterRequest;
import com.vinsuite.dto.common.LoginRequest;
import com.vinsuite.repository.UserRepository;
import com.vinsuite.service.MailService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MailService mailService;

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

        // ✅ Generate activation token and expiry
        String token = UUID.randomUUID().toString();
        user.setActivated(false);
        user.setActivationToken(token);
        user.setActivationTokenExpiry(LocalDateTime.now().plusHours(24)); // expires in 24 hrs

        userRepository.save(user);
        mailService.sendActivationEmail(user);

        // ⏳ We will add email sending here in the next step
        return ResponseEntity.ok("User registered successfully. Please check your email to activate your account.");
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail());

        if (user == null) {
            return ResponseEntity.status(401).body("Invalid email or password");
        }

        // ✅ Prevent login if not activated
        if (!user.isActivated()) {
            return ResponseEntity.status(403).body("Account not activated. Please check your email.");
        }

        boolean isMatch = passwordEncoder.matches(request.getPassword(), user.getPassword());
        if (!isMatch) {
            return ResponseEntity.status(401).body("Invalid email or password");
        }

        return ResponseEntity.ok(user);
    }

    @GetMapping("/activate")
    public ResponseEntity<?> activateUser(@RequestParam("token") String token) {
        User user = userRepository.findByActivationToken(token);

        if (user == null) {
            return ResponseEntity.badRequest().body("Invalid activation token.");
        }

        if (user.isActivated()) {
            return ResponseEntity.ok("Account is already activated.");
        }

        if (user.getActivationTokenExpiry().isBefore(LocalDateTime.now())) {
            return ResponseEntity.status(410).body("Activation link has expired.");
        }

        user.setActivated(true);
        user.setActivationToken(null); // Clear token
        user.setActivationTokenExpiry(null); // Optional
        userRepository.save(user);

        return ResponseEntity.ok("Account activated successfully! You may now log in.");
    }

    @PostMapping("/resend-activation")
    public ResponseEntity<?> resendActivation(@RequestParam String email) {
        User user = userRepository.findByEmail(email);

        if (user == null) {
            return ResponseEntity.status(404).body("No user found with that email.");
        }

        if (user.isActivated()) {
            return ResponseEntity.ok("Account is already activated.");
        }

        // Generate new token and expiry
        String newToken = UUID.randomUUID().toString();
        user.setActivationToken(newToken);
        user.setActivationTokenExpiry(LocalDateTime.now().plusHours(24));
        userRepository.save(user);

        // Resend email
        mailService.sendActivationEmail(user);

        return ResponseEntity.ok("A new activation link has been sent to your email.");
    }

}
