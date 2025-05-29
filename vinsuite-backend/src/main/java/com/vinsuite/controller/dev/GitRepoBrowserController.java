package com.vinsuite.controller.dev;

import com.vinsuite.service.dev.GitRepoExplorerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/dev/git")
public class GitRepoBrowserController {

    @Autowired
    private GitRepoExplorerService explorerService;

    @PostMapping("/list")
    public ResponseEntity<?> listFiles(@RequestBody Map<String, String> body) {
        String rootPath = body.get("path");
        if (rootPath == null || rootPath.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Missing path to list files."));
        }

        try {
            return ResponseEntity.ok(explorerService.listRepoFiles(rootPath));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/read")
    public ResponseEntity<?> readFile(@RequestBody Map<String, String> body) {
        String filePath = body.get("filePath");
        if (filePath == null || filePath.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Missing filePath to read."));
        }

        try {
            String content = explorerService.readFileContent(filePath);
            return ResponseEntity.ok(Map.of("content", content));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

}
