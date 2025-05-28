package com.vinsuite.controller;

import com.vinsuite.model.User;
import com.vinsuite.repository.UserRepository;
import com.vinsuite.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;

    // ✅ Create a new user
    @PostMapping
    public User createUser(@RequestBody User user) {
        return userRepository.save(user);
    }

    // ✅ Get all users
    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // ✅ Get users filtered by tenant ID
    @GetMapping("/by-tenant")
    public List<User> getUsersByTenantId(@RequestParam UUID tenantId) {
        return userService.getUsersByTenantId(tenantId);
    }

    // ✅ Get a specific user by UUID
    @GetMapping("/{id}")
    public User getUserById(@PathVariable UUID id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + id));
    }
}
