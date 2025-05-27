package com.vinsuite.controller.dev;

import com.vinsuite.service.dev.*;
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

    ResponseEntity<String> response = reviewService.reviewCode(code, language);

    // If error, return directly
    if (!response.getStatusCode().is2xxSuccessful()) {
        return response;
    }

    try {
        // Parse response JSON and extract message content
        org.json.JSONObject raw = new org.json.JSONObject(response.getBody());
        String content = raw
            .getJSONArray("choices")
            .getJSONObject(0)
            .getJSONObject("message")
            .getString("content");

        return ResponseEntity.ok(content);
    } catch (Exception e) {
        return ResponseEntity.status(500).body("// Error parsing LLM response: " + e.getMessage());
    }
}

}

