package com.vinsuite.config;

import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Autowired;
import com.vinsuite.model.User;
import com.vinsuite.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Component
public class AdminSeeder {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @PostConstruct
    public void insertAdminUser() {
        String adminEmail = "admin@vinsuite.com";
        if (!userRepository.existsByEmail(adminEmail)) {
            User admin = new User();
            admin.setName("Admin");
            admin.setEmail(adminEmail);
            admin.setPassword(passwordEncoder.encode("admin123")); // secure in real apps
            admin.setRole("admin");
            admin.setDepartment("IT");
            userRepository.save(admin);

            System.out.println("✅ Admin user created with email: " + adminEmail);
        } else {
            System.out.println("ℹ️ Admin user already exists.");
        }
    }
}
