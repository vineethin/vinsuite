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

    @PostMapping("/suggestions")
    public ResponseEntity<Map<String, Object>> getSuggestions(@RequestBody Map<String, Object> payload) {
        Object rawUrl = payload.get("url");
        if (!(rawUrl instanceof String) || ((String) rawUrl).isBlank()) {
            return ResponseEntity.badRequest().body(Map.of(
                "suggestions", Collections.emptyMap(),
                "error", "Valid URL is required"
            ));
        }

        String url = ((String) rawUrl).trim();
        String prompt = buildPrompt(url);

        Map<String, Object> requestBody = Map.of(
            "model", groqModelName,
            "messages", List.of(
                Map.of("role", "system", "content", "You're a test case suggestion assistant."),
                Map.of("role", "user", "content", prompt)
            )
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
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                    "suggestions", Collections.emptyMap(),
                    "error", "Empty response from Groq"
                ));
            }

            Object first = ((List<?>) responseBody.get("choices")).get(0);
            Map<?, ?> message = (Map<?, ?>) ((Map<?, ?>) first).get("message");
            String content = (String) message.get("content");

            // 🧠 DEBUG: Print raw AI output (remove in production)
            System.out.println("🧠 AI Raw Content:\n" + content);

            // Extract valid JSON from raw response
            String jsonOnly = extractJson(content);
            if (jsonOnly.isBlank()) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                    "suggestions", Collections.emptyMap(),
                    "error", "AI response did not contain valid JSON"
                ));
            }

            Map<String, List<String>> parsedSuggestions = objectMapper.readValue(
                jsonOnly,
                new TypeReference<>() {}
            );

            return ResponseEntity.ok(Map.of("suggestions", parsedSuggestions));

        } catch (Exception e) {
            e.printStackTrace(); // Log for debugging
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                "suggestions", Collections.emptyMap(),
                "error", "Groq API call failed: " + e.getMessage()
            ));
        }
    }

    private String buildPrompt(String url) {
        return "You are a QA assistant. Analyze the following URL and suggest possible test cases grouped by category. " +
                "Categories can include Functional, Security, Accessibility, API, Responsiveness, etc. " +
                "Respond ONLY in JSON format like: " +
                "{ \"Functional\": [\"Test A\", \"Test B\"], \"Security\": [\"Test C\"] }.\n" +
                "URL: " + url;
    }

    /**
     * Extracts JSON block from AI response text (first '{' to last '}')
     */
    private String extractJson(String text) {
        int start = text.indexOf('{');
        int end = text.lastIndexOf('}');
        if (start != -1 && end != -1 && end > start) {
            return text.substring(start, end + 1);
        }
        return "";
    }
}
