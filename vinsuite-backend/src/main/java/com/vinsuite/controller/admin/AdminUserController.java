package com.vinsuite.controller.admin;

import com.vinsuite.dto.common.UserDTO;
import com.vinsuite.model.User;
import com.vinsuite.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
public class AdminUserController {

    @Autowired
    private UserRepository userRepository;

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

    @GetMapping("/users/count")
    public ResponseEntity<Long> getUserCount() {
        return ResponseEntity.ok(userRepository.count());
    }
}
// This code defines an AdminUserController that provides endpoints to retrieve all users and the total user count.
// It uses a UserRepository to fetch user data and maps it to a UserDTO for the response.