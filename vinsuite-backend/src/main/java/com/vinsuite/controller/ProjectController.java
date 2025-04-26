package com.vinsuite.controller;

import com.vinsuite.model.Project;
import com.vinsuite.model.User;
import com.vinsuite.repository.ProjectRepository;
import com.vinsuite.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private UserRepository userRepository;

    // Create a new project
    @PostMapping
    public Project createProject(@RequestBody ProjectRequest projectRequest) {
        Long userId = projectRequest.getUserId();
        Project project = projectRequest.getProject();
        
        // Fetch user by ID
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        project.setCreatedBy(user); // Set the user who created the project
        return projectRepository.save(project);
    }

    // List all projects
    @GetMapping
    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    // DTO class to handle userId and Project data
    public static class ProjectRequest {
        private Long userId;
        private Project project;

        public Long getUserId() {
            return userId;
        }

        public void setUserId(Long userId) {
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
