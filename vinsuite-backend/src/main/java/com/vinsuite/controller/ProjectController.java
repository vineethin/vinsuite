package com.vinsuite.controller;

import com.vinsuite.model.Project;
import com.vinsuite.model.User;
import com.vinsuite.repository.ProjectRepository;
import com.vinsuite.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private UserRepository userRepository;

    // ✅ Create a new project
    @PostMapping
    public Project createProject(@RequestBody ProjectRequest projectRequest) {
        if (projectRequest.getUserId() == null || projectRequest.getProject() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User ID and Project data are required");
        }

        UUID userId = projectRequest.getUserId();

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        Project project = projectRequest.getProject();
        project.setCreatedBy(user);

        return projectRepository.save(project);
    }

    // ✅ List all projects
    @GetMapping
    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    // ✅ List projects by tenant ID (for company-specific views)
    @GetMapping("/by-tenant")
    public List<Project> getProjectsByTenant(@RequestParam UUID tenantId) {
        return projectRepository.findByTenantId(tenantId);
    }

    // ✅ DTO class to handle userId and Project data
    public static class ProjectRequest {
        private UUID userId;
        private Project project;

        public UUID getUserId() {
            return userId;
        }

        public void setUserId(UUID userId) {
            this.userId = userId;
        }

        public Project getProject() {
            return project;
        }

        public void setProject(Project project) {
            this.project = project;
        }
    }
}
