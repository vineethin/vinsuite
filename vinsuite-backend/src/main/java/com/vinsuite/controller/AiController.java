package com.vinsuite.controller;

import com.vinsuite.dto.SmartTestCaseRequest;
import com.vinsuite.dto.HtmlInputRequest;
import com.vinsuite.service.TestCaseGenerationService;
import com.vinsuite.service.PageFactoryGeneratorService;
import com.vinsuite.service.PageObjectGenerationService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
public class AiController {

    @Autowired
    private TestCaseGenerationService testCaseService;

    @Autowired
    private PageFactoryGeneratorService pageFactoryService;

    @Autowired
    private PageObjectGenerationService pageObjectService;

    @PostMapping("/generate-test-cases")
    public ResponseEntity<?> generateTestCases(@RequestBody Map<String, String> request) {
        return testCaseService.generateTestCasesFromText(request);
    }

    @PostMapping("/generate-smart-test-cases")
    public ResponseEntity<?> generateSmartTestCases(@RequestBody SmartTestCaseRequest request) {
        return testCaseService.generateSmartTestCasesFromImage(request);
    }

    @PostMapping("/generate-pagefactory")
    public ResponseEntity<?> generatePageFactory(@RequestBody HtmlInputRequest request) {
        return pageFactoryService.generateFromHtml(request.getHtml());
    }

    @PostMapping("/generate-pageobject")
    public ResponseEntity<?> generatePageObject(@RequestBody Map<String, String> request) {
        System.out.println("📩 Incoming Request Payload: " + request);

    String html = request.get("html");
    String language = request.getOrDefault("language", "java");

    if (html == null || html.isEmpty()) {
        return ResponseEntity.badRequest().body(Map.of("error", "Missing HTML content"));
    }

    return pageObjectService.generate(html, language);
    }
}
