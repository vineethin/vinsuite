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
        String normalizedEmail = request.getEmail().toLowerCase();
        User existingUser = userRepository.findByEmailIgnoreCase(normalizedEmail);

        if (existingUser != null) {
            System.out.println("🟡 Existing user found: " + existingUser.getEmail() + " | Activated: " + existingUser.isActivated());
            if (existingUser.isActivated()) {
                return ResponseEntity.status(409).body("Email already registered.");
            } else {
                // 🔁 Resend activation
                String token = UUID.randomUUID().toString();
                existingUser.setActivationToken(token);
                existingUser.setActivationTokenExpiry(LocalDateTime.now().plusHours(24));
                userRepository.save(existingUser);

                mailService.sendActivationEmail(existingUser);
                return ResponseEntity.status(409).body("Account not activated. We've resent your activation link.");
            }
        }

        // ✅ New user registration
        User user = new User();
        user.setName(request.getName());
        user.setEmail(normalizedEmail); // Always store lowercase
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());
        user.setDepartment(request.getDepartment());

        String token = UUID.randomUUID().toString();
        user.setActivated(false);
        user.setActivationToken(token);
        user.setActivationTokenExpiry(LocalDateTime.now().plusHours(24));

        userRepository.save(user);
        mailService.sendActivationEmail(user);

        return ResponseEntity.ok("User registered successfully. Please check your email to activate your account.");
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest request) {
        String normalizedEmail = request.getEmail().toLowerCase();
        User user = userRepository.findByEmailIgnoreCase(normalizedEmail);

        if (user == null || !passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return ResponseEntity.status(401).body("Invalid email or password");
        }

        if (!user.isActivated()) {
            return ResponseEntity.status(403).body("Account not activated. Please check your email.");
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
        user.setActivationToken(null);
        user.setActivationTokenExpiry(null);
        userRepository.save(user);

        return ResponseEntity.ok("Account activated successfully! You may now log in.");
    }

    @PostMapping("/resend-activation")
    public ResponseEntity<?> resendActivation(@RequestParam String email) {
        String normalizedEmail = email.toLowerCase();
        User user = userRepository.findByEmailIgnoreCase(normalizedEmail);

        if (user == null) {
            return ResponseEntity.status(404).body("No user found with that email.");
        }

        if (user.isActivated()) {
            return ResponseEntity.ok("Account is already activated.");
        }

        String newToken = UUID.randomUUID().toString();
        user.setActivationToken(newToken);
        user.setActivationTokenExpiry(LocalDateTime.now().plusHours(24));
        userRepository.save(user);

        mailService.sendActivationEmail(user);
        return ResponseEntity.ok("A new activation link has been sent to your email.");
    }
}
