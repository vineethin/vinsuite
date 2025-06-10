package com.vinsuite.repository;

import com.vinsuite.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByEmail(String email);
    boolean existsByEmail(String email);

    // ✅ Case-insensitive versions
    User findByEmailIgnoreCase(String email);
    boolean existsByEmailIgnoreCase(String email);

    User findByActivationToken(String token);
}
