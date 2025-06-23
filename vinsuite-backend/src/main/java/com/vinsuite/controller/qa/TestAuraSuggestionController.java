package com.vinsuite.controller.qa;

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

    @PostMapping("/suggestions")
    public ResponseEntity<?> getSuggestions(@RequestBody Map<String, Object> payload) {
        Object rawUrl = payload.get("url");
        if (!(rawUrl instanceof String) || ((String) rawUrl).isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Valid URL is required"));
        }

        String url = ((String) rawUrl).trim();
        String prompt = buildPrompt(url);

        Map<String, Object> requestBody = Map.of(
                "model", groqModelName,
                "messages", List.of(
                        Map.of("role", "system", "content", "You're a test case suggestion assistant."),
                        Map.of("role", "user", "content", prompt)));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(groqApiKey);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(
                    "https://api.groq.com/openai/v1/chat/completions",
                    request,
                    Map.class);

            Map<?, ?> responseBody = response.getBody();
            if (responseBody == null || !responseBody.containsKey("choices")) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(Map.of("message", "Groq response invalid or empty"));
            }

            List<?> choices = (List<?>) responseBody.get("choices");
            if (choices.isEmpty()) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(Map.of("message", "No choices returned by Groq"));
            }

            Object first = choices.get(0);
            if (!(first instanceof Map)) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(Map.of("message", "Malformed choice in Groq response"));
            }

            Map<?, ?> firstChoice = (Map<?, ?>) first;
            Map<?, ?> message = (Map<?, ?>) firstChoice.get("message");
            String content = (String) message.get("content");

            List<String> suggestions = Arrays.stream(content.split("\\n"))
                    .map(String::trim)
                    .filter(line -> !line.isBlank())
                    .toList();

            return ResponseEntity.ok(Map.of("suggestions", suggestions));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Groq API call failed", "error", e.getMessage()));
        }
    }

    private String buildPrompt(String url) {
        return "You are a QA assistant. Analyze the following URL and suggest possible test cases grouped by category. "
                +
                "Categories can include Functional, Security, Accessibility, API, Responsiveness, etc. " +
                "Respond ONLY in JSON format like: " +
                "{ \"Functional\": [\"Test A\", \"Test B\"], \"Security\": [\"Test C\"] }.\n" +
                "URL: " + url;
    }

}
