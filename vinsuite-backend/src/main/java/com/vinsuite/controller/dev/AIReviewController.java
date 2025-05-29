package com.vinsuite.controller.dev;

import com.vinsuite.service.dev.AIReviewService;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/dev")
public class AIReviewController {

    @Autowired
    private AIReviewService reviewService;

    @PostMapping("/ai-review")
    public ResponseEntity<String> reviewCode(@RequestBody Map<String, String> body) {
        String code = body.get("code");
        String language = body.get("language");

        if (code == null || code.isBlank()) {
            return ResponseEntity.badRequest().body("// Error: Code input is required.");
        }
        if (language == null || language.isBlank()) {
            return ResponseEntity.badRequest().body("// Error: Language selection is required.");
        }

        // Call the AI review service
        ResponseEntity<String> response = reviewService.reviewCode(code, language);

        if (!response.getStatusCode().is2xxSuccessful()) {
            return response;
        }

        try {
            // Parse LLM response and extract the message content
            JSONObject raw = new JSONObject(response.getBody());
            String content = raw
                    .optJSONArray("choices")
                    .optJSONObject(0)
                    .optJSONObject("message")
                    .optString("content", "// Error: No content received from LLM.");

            return ResponseEntity.ok(content);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("// Error parsing LLM response: " + e.getMessage());
        }
    }
}
