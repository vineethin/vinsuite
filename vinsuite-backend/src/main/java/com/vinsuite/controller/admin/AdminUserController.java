package com.vinsuite.controller.admin;

import com.vinsuite.dto.common.UserDTO;
import com.vinsuite.model.User;
import com.vinsuite.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
public class AdminUserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    // ✅ List all users as DTOs
    @GetMapping("/users")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        List<UserDTO> users = userRepository.findAll().stream()
            .map(user -> new UserDTO(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole(),
                user.getDepartment()
            ))
            .collect(Collectors.toList());

        return ResponseEntity.ok(users);
    }

    // ✅ Get total user count
    @GetMapping("/users/count")
    public ResponseEntity<Long> getUserCount() {
        return ResponseEntity.ok(userRepository.count());
    }

    // ✅ Create company admin (only superadmin can perform this)
    @PostMapping("/create-company-admin")
    public ResponseEntity<?> createCompanyAdmin(@RequestBody UserDTO request, @RequestParam String currentAdminEmail) {
        User requester = userRepository.findByEmail(currentAdminEmail)
            .orElseThrow(() -> new RuntimeException("Invalid requester"));

        if (!"admin".equalsIgnoreCase(requester.getRole())) {
            return ResponseEntity.status(403).body("Only super admins can create company admins");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.status(409).body("Email already exists");
        }

        User companyAdmin = new User();
        companyAdmin.setName(request.getName());
        companyAdmin.setEmail(request.getEmail());

        // Hash password properly
        if (request.getPassword() == null || request.getPassword().isBlank()) {
            return ResponseEntity.badRequest().body("Password is required");
        }
        companyAdmin.setPassword(passwordEncoder.encode(request.getPassword()));

        companyAdmin.setRole("companyadmin");
        companyAdmin.setDepartment(request.getDepartment());
        companyAdmin.setTenantId(UUID.randomUUID()); // Generate unique tenant ID

        userRepository.save(companyAdmin);
        return ResponseEntity.ok("Company admin created successfully");
    }
}
