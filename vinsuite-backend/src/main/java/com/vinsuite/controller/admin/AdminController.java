// src/main/java/com/vinsuite/controller/admin/AdminController.java
package com.vinsuite.controller.admin;

import com.vinsuite.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/user-count")
    public ResponseEntity<Long> getUserCount() {
        long count = userRepository.count();
        return ResponseEntity.ok(count);
    }
}
