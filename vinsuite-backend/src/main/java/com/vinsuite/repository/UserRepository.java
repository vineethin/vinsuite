package com.vinsuite.repository;

import com.vinsuite.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {  // ✅ FIXED: use Long

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    List<User> findByTenantId(UUID tenantId);
}
