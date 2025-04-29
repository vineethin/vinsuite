package com.vinsuite.controller;

import com.vinsuite.service.GroqAIService;
import com.vinsuite.service.PageObjectGenerationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/groq")
public class GroqAIController {

    @Autowired
    private GroqAIService groqAIService;

    @Autowired
    private PageObjectGenerationService pageObjectGenerationService;

    // ✅ POST endpoint to generate test cases from feature/user prompt
    @PostMapping("/generate-test-cases")
    public ResponseEntity<Map<String, Object>> generateTestCases(@RequestBody Map<String, String> request) {
        try {
            String userPrompt = request.get("feature");
            if (userPrompt == null || userPrompt.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Feature prompt cannot be empty."));
            }

            Map<String, Object> response = groqAIService.generateTestCases(userPrompt);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Failed to generate test cases: " + e.getMessage()));
        }
    }

    // ✅ POST endpoint to generate page object code
    @PostMapping("/generate-pageobject")
    public ResponseEntity<?> generatePageObject(@RequestBody Map<String, String> request) {
        try {
            String html = request.get("html");
            String language = request.get("language");

            if (html == null || html.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "HTML input is required."));
            }

            return pageObjectGenerationService.generate(html, language);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Failed to generate page object: " + e.getMessage()));
        }
    }
}
