package com.vinsuite.controller;

import com.vinsuite.dto.CoverageEstimateRequest;
import com.vinsuite.service.GroqAIService;
import com.vinsuite.service.PageObjectGenerationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
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

    // ✅ Generate test cases from feature prompt
    @PostMapping("/generate-test-cases")
    public ResponseEntity<Map<String, Object>> generateTestCases(@RequestBody Map<String, String> request) {
        try {
            String userPrompt = request.get("feature");
            if (userPrompt == null || userPrompt.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Feature prompt cannot be empty."));
            }
            return ResponseEntity.ok(groqAIService.generateTestCases(userPrompt));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Failed to generate test cases: " + e.getMessage()));
        }
    }

    // ✅ Generate Page Object
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

    // ✅ Estimate test coverage (Basic or Deep Mode)
    @PostMapping("/coverage-estimator")
    public ResponseEntity<?> estimateCoverage(@RequestBody CoverageEstimateRequest request) {
        try {
            if (request.getUserStories() == null || request.getTestCases() == null) {
                return ResponseEntity.badRequest().body(Map.of(
                    "error", "User stories and test cases are required"
                ));
            }

            Map<String, Object> result = request.isDeepMode()
                ? groqAIService.estimateDeepCoverage(
                      request.getUserStories(),
                      request.getAcceptanceCriteria(),
                      request.getTestCases(),
                      request.getTestCaseSteps()
                  )
                : groqAIService.estimateCoverage(
                      request.getUserStories(),
                      request.getTestCases(),
                      false
                  );

            return ResponseEntity.ok(result);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body(Map.of("error", "Coverage estimation failed: " + e.getMessage()));
        }
    }
}
