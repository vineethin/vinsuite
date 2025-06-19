package com.vinsuite.config;

import com.vinsuite.model.User;
import com.vinsuite.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import java.util.Optional;
import java.util.logging.Logger;

/**
 * Seeds the initial admin user into the database if not already present.
 */
@Component
public class AdminSeeder {

    private static final Logger LOGGER = Logger.getLogger(AdminSeeder.class.getName());

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    /**
     * Inserts a default admin user at startup if one doesn't exist.
     */
    @PostConstruct
    @Transactional
    public void insertAdminUser() {
        String adminEmail = "admin@vinsuite.com";

        Optional<User> existing = Optional.ofNullable(userRepository.findByEmailIgnoreCase(adminEmail));
        if (existing.isEmpty()) {
            User admin = new User();
            admin.setName("Admin");
            admin.setEmail(adminEmail);
            admin.setPassword(passwordEncoder.encode("admin123")); // 🔐 Replace for production
            admin.setRole("admin");
            admin.setDepartment("IT");
            admin.setActivated(true);
            userRepository.save(admin);

            LOGGER.info("✅ Admin user created with email: " + adminEmail);
        } else {
            LOGGER.info("ℹ️ Admin user already exists. Skipping seeding.");
        }
    }
}
