package com.vinsuite.controller.qa;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@RestController
@RequestMapping("/api/testaura")
public class TestAuraSuggestionController {

    @Value("${groq.api.key}")
    private String groqApiKey;

    @Value("${groq.model.name}")
    private String groqModelName;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    private static final boolean ENABLE_LOGGING = true;

    @PostMapping("/suggestions")
    public ResponseEntity<Map<String, Object>> getSuggestions(@RequestBody Map<String, Object> payload) {
        Object rawUrl = payload.get("url");
        if (!(rawUrl instanceof String) || ((String) rawUrl).isBlank()) {
            return error("Valid URL is required");
        }

        String url = ((String) rawUrl).trim();
        String prompt = buildPrompt(url);

        Map<String, Object> requestBody = Map.of(
            "model", groqModelName,
            "messages", List.of(
                Map.of("role", "system", "content", "You are a JSON-only QA assistant."),
                Map.of("role", "user", "content", prompt)
            ),
            "temperature", 0.3
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(groqApiKey);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(
                "https://api.groq.com/openai/v1/chat/completions",
                request,
                Map.class
            );

            Map<?, ?> responseBody = response.getBody();
            if (responseBody == null || !responseBody.containsKey("choices")) {
                return error("Empty response from Groq");
            }

            Object first = ((List<?>) responseBody.get("choices")).get(0);
            Map<?, ?> message = (Map<?, ?>) ((Map<?, ?>) first).get("message");
            String content = (String) message.get("content");

            if (ENABLE_LOGGING) {
                System.out.println("🧠 Raw AI Content:\n" + content);
            }

            String jsonOnly = extractJson(content);
            if (jsonOnly.isBlank()) {
                return error("AI response did not contain valid JSON. Raw:\n" + content);
            }

            Map<String, List<String>> parsedSuggestions = objectMapper.readValue(
                jsonOnly,
                new TypeReference<>() {}
            );

            return ResponseEntity.ok(Map.of("suggestions", parsedSuggestions));

        } catch (Exception e) {
            if (ENABLE_LOGGING) e.printStackTrace();
            return error("Groq API call failed: " + e.getMessage());
        }
    }

    private ResponseEntity<Map<String, Object>> error(String message) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
            "suggestions", Collections.emptyMap(),
            "error", message
        ));
    }

    private String buildPrompt(String url) {
        return """
            Analyze the given website and suggest grouped QA test cases.

            ⚠️ Respond ONLY with raw JSON — no text, explanation, or markdown. 
            No code blocks like ```json — return just JSON.

            Categories: Functional, Security, Accessibility, Responsiveness, API, SEO, UX, etc.

            Example:
            {
              "Functional": ["Test login", "Verify search"],
              "Accessibility": ["Check alt tags"]
            }

            URL: %s
            """.formatted(url);
    }

    /**
     * Attempts to extract the clean JSON portion from the AI response.
     */
    private String extractJson(String text) {
        if (text.contains("```json")) {
            text = text.replaceAll("(?s)```json\\s*(\\{.*?\\})\\s*```", "$1");
        } else if (text.contains("```")) {
            text = text.replaceAll("(?s)```\\s*(\\{.*?\\})\\s*```", "$1");
        }

        int start = text.indexOf('{');
        int end = text.lastIndexOf('}');
        if (start >= 0 && end > start) {
            String candidate = text.substring(start, end + 1);
            try {
                objectMapper.readTree(candidate); // ensure it's valid JSON
                return candidate;
            } catch (Exception e) {
                System.out.println("❌ JSON validation failed: " + e.getMessage());
            }
        }
        return "";
    }
}