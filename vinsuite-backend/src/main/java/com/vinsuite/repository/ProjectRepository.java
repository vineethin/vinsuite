package com.vinsuite.repository;

import com.vinsuite.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {

    // ✅ Returns all projects belonging to a tenant
    List<Project> findByTenantId(UUID tenantId);

    // Optional: used in stats endpoint
    int countByTenantId(UUID tenantId);
}
