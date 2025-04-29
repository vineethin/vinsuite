package com.vinsuite.service;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Map;

@Service
public class AccessibilityService {
    public ResponseEntity<?> scan(String url) {
        // For now, just return a mock response
        return ResponseEntity.ok(Map.of(
                "violations", List.of(
                        Map.of("description", "Image alt text missing", "impact", "moderate", "nodes", List.of(Map.of("html", "<img src='logo.png'>"))),
                        Map.of("description", "Button without accessible name", "impact", "serious", "nodes", List.of(Map.of("html", "<button></button>")))
                )
        ));
    }
}
