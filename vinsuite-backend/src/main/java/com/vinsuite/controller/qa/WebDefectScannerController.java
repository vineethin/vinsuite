package com.vinsuite.controller.qa;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.vinsuite.service.qa.QAGroqAIService;

import java.io.IOException;

@RestController
@RequestMapping("/api/qa") // ✅ More consistent base path for QA tools
public class WebDefectScannerController {

    @Autowired
    private QAGroqAIService qaGroqAIService;

    @PostMapping("/defect-scan")
    public ResponseEntity<?> analyzePage(
            @RequestParam("url") String url,
            @RequestParam(value = "screenshot", required = false) MultipartFile screenshot) {
        try {
            // Step 1: Fetch HTML content from the provided URL
            Document doc = Jsoup.connect(url).get();
            String html = doc.html();

            // Step 2: Compress HTML to reduce LLM token usage
            String compressedHtml = compressHtml(html);

            // Step 3: Build AI prompt for web defect analysis
            String prompt = "You are a senior QA engineer. Perform an AI-based defect scan on the following HTML. " +
                    "Return results in JSON format with fields: title, severity, suggestedFix. " +
                    "Focus on UI alignment issues, missing labels, broken links, accessibility violations, and bad UX patterns.\n\n"
                    +
                    compressedHtml;

            // Step 4: Call Groq/OpenAI service to analyze the page
            String aiJson = qaGroqAIService.generateDefectsFromHtml(prompt);

            return ResponseEntity.ok(aiJson);

        } catch (IOException e) {
            return ResponseEntity.status(500).body("Failed to fetch HTML: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("AI processing error: " + e.getMessage());
        }
    }

    private String compressHtml(String html) {
        String compressed = html
                .replaceAll("(?s)<script.*?>.*?</script>", "")
                .replaceAll("(?s)<style.*?>.*?</style>", "")
                .replaceAll("(?s)<!--.*?-->", "")
                .replaceAll("<(meta|link|noscript)[^>]*>", "")
                .replaceAll("\\s{2,}", " ")
                .replaceAll(">\\s+<", "><")
                .replaceAll(" style=\"[^\"]*\"", "")
                .replaceAll(" class=\"[^\"]*\"", "")
                .replaceAll(" id=\"[^\"]*\"", "")
                .trim();

        // Truncate to first N characters to stay under token limits
        int maxLength = 8000; // You can tune this based on model/token budget
        return compressed.length() > maxLength ? compressed.substring(0, maxLength) : compressed;
    }

}
