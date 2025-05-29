package com.vinsuite.controller.dev;

import com.vinsuite.service.dev.GitCloneService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/dev")
public class GitCloneController {

    @Autowired
    private GitCloneService gitCloneService;

    @PostMapping("/git/clone")
    public ResponseEntity<?> cloneRepo(@RequestBody Map<String, String> body) {
        String repoUrl = body.get("repoUrl");
        String branch = body.getOrDefault("branch", "main");

        if (repoUrl == null || repoUrl.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Repository URL is required."));
        }

        try {
            String message = gitCloneService.cloneRepository(repoUrl, branch);
            return ResponseEntity.ok(Map.of("message", message));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }
}
