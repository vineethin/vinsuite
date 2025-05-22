package com.vinsuite.controller.qa;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.vinsuite.service.qa.QAGroqAIService; // ✅ make sure this exists

import java.io.IOException;

@RestController
@RequestMapping("/api")
public class WebDefectScannerController {

    @Autowired
    private QAGroqAIService qaGroqAIService;

    @PostMapping("/defect-scan")
    public ResponseEntity<?> analyzePage(
            @RequestParam("url") String url,
            @RequestParam(value = "screenshot", required = false) MultipartFile screenshot
    ) {
        try {
            // Step 1: Fetch HTML
            Document doc = Jsoup.connect(url).get();
            String html = doc.html();

            // Step 2: Create AI prompt
            String prompt = "You are a senior QA tester. Analyze the following HTML and generate a list of functional and UI defects using test strategies like boundary value analysis, negative testing, and form validation.\n\nHTML:\n" + html;

            // Step 3: Call Groq/OpenAI
            String aiJson = qaGroqAIService.generateDefectsFromHtml(prompt);

            return ResponseEntity.ok(aiJson);

        } catch (IOException e) {
            return ResponseEntity.status(500).body("Failed to fetch HTML: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("AI processing error: " + e.getMessage());
        }
    }
}
