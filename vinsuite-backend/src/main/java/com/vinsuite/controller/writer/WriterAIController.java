package com.vinsuite.controller.writer;

import com.vinsuite.ratelimiter.RateLimiterService;
import com.vinsuite.service.writer.WriterAIService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/writer")
public class WriterAIController {

    @Autowired
    private WriterAIService writerAIService;

    @Autowired
    private RateLimiterService rateLimiterService;

    @PostMapping("/generate-content")
    public ResponseEntity<String> generateContent(
            @RequestHeader(value = "X-USER-ID", defaultValue = "anonymous") String userId,
            @RequestBody Map<String, String> request) {

        String topic = request.get("topic");
        String tone = request.get("tone");
        String audience = request.get("audience");
        String role = "writer";

        if (topic == null || tone == null || audience == null) {
            return ResponseEntity.badRequest().body("Missing fields in request");
        }

        if (!rateLimiterService.isAllowed(userId, role)) {
            return ResponseEntity.status(429).body("⚠️ Daily quota exceeded. Try again tomorrow.");
        }

        String prompt = String.format(
                "You are a professional content writer. Generate a high-quality article based on the following:\n" +
                        "Topic: \"%s\"\nTone: %s\nTarget Audience: %s\n\nWrite at least 300 words.",
                topic, tone, audience);

        String result = writerAIService.generate("You are a helpful writing assistant.", prompt);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/generate-email")
    public ResponseEntity<String> generateEmail(
            @RequestHeader(value = "X-USER-ID", defaultValue = "anonymous") String userId,
            @RequestBody Map<String, String> request) {

        String emailType = request.get("emailType");
        String productOrService = request.get("productOrService");
        String recipient = request.get("recipient");
        String role = "writer";

        if (emailType == null || productOrService == null || recipient == null) {
            return ResponseEntity.badRequest().body("Missing fields in request");
        }

        if (!rateLimiterService.isAllowed(userId, role)) {
            return ResponseEntity.status(429).body("⚠️ Daily quota exceeded. Try again tomorrow.");
        }

        String prompt = String.format(
                "You are a professional email copywriter. Generate a %s email.\n\n" +
                        "Topic: %s\nAudience: %s\n\n" +
                        "Keep it clear, persuasive, and under 200 words.",
                emailType, productOrService, recipient);

        String result = writerAIService.generate("You are a helpful AI email writer.", prompt);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/generate-document")
    public ResponseEntity<String> generateDocument(
            @RequestHeader(value = "X-USER-ID", defaultValue = "anonymous") String userId,
            @RequestBody Map<String, String> request) {

        String docType = request.get("docType");
        String purpose = request.get("purpose");
        String points = request.get("points");
        String role = "writer";

        if (docType == null || purpose == null || points == null) {
            return ResponseEntity.badRequest().body("Missing fields in request");
        }

        if (!rateLimiterService.isAllowed(userId, role)) {
            return ResponseEntity.status(429).body("⚠️ Daily quota exceeded. Try again tomorrow.");
        }

        String prompt = String.format(
                "You are a professional document writer. Create a structured %s.\n" +
                        "Purpose: %s\n\nInclude the following points:\n%s\n\n" +
                        "Make it well-formatted and professional. Use headings and bullet points where helpful.",
                docType, purpose, points);

        String result = writerAIService.generate("You are an expert technical and business writer.", prompt);
        return ResponseEntity.ok(result);
    }

    // ✅ NEW: Get remaining quota
    @GetMapping("/quota")
    public ResponseEntity<String> getRemainingQuota(
            @RequestHeader(value = "X-USER-ID", defaultValue = "anonymous") String userId) {
        String role = "writer";
        int remaining = rateLimiterService.getRemainingQuota(userId, role);
        return ResponseEntity.ok(String.valueOf(remaining));
    }
}
