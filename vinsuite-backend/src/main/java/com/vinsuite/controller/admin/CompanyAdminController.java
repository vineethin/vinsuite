package com.vinsuite.controller.admin;

import com.vinsuite.model.Project;
import com.vinsuite.model.User;
import com.vinsuite.repository.ProjectRepository;
import com.vinsuite.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;

@RestController
@RequestMapping("/api/company")
public class CompanyAdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProjectRepository projectRepository;

    /**
     * Get basic stats for a company: total users and projects by tenant
     */
    @GetMapping("/stats")
    public Map<String, Object> getCompanyStats(@RequestParam UUID tenantId) {
        int users = userRepository.findByTenantId(tenantId).size();
        int projects = projectRepository.countByTenantId(tenantId);

        Map<String, Object> stats = new HashMap<>();
        stats.put("users", users);
        stats.put("projects", projects);
        return stats;
    }

    /**
     * Create a new project for a specific company (tenant)
     */
    @PostMapping("/project")
    public Project createProject(@RequestBody ProjectRequest request) {
        UUID userId = request.getUserId();

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        Project project = new Project();
        project.setName(request.getName());
        project.setDescription(request.getDescription());
        project.setTenantId(request.getTenantId());
        project.setCreatedBy(user);

        return projectRepository.save(project);
    }

    /**
     * DTO for incoming project creation request
     */
    public static class ProjectRequest {
        private String name;
        private String description;
        private UUID tenantId;
        private UUID userId;

        // Getters and Setters
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }

        public UUID getTenantId() { return tenantId; }
        public void setTenantId(UUID tenantId) { this.tenantId = tenantId; }

        public UUID getUserId() { return userId; }
        public void setUserId(UUID userId) { this.userId = userId; }
    }
}
