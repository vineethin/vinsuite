package com.vinsuite.service.dev;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class AIReviewService {

    @Value("${groq.api.key}")
    private String groqApiKey;

    private static final String GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public ResponseEntity<String> reviewCode(String code, String language) {
        try {
            String prompt = String.format("""
                You are a senior software engineer.

                Review the following %s code and provide feedback on:
                - Code quality
                - Potential bugs
                - Refactoring suggestions
                - Best practices

                Code:
                %s
                """, language, code);

            // Create headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(groqApiKey);

            // Construct the body
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", "mixtral-8x7b-32768");

            List<Map<String, String>> messages = List.of(
                Map.of("role", "user", "content", prompt)
            );
            requestBody.put("messages", messages);

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

            // Send request
            ResponseEntity<Map> response = restTemplate.postForEntity(GROQ_API_URL, request, Map.class);

            // Extract content
            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                Map firstChoice = ((List<Map>) response.getBody().get("choices")).get(0);
                Map message = (Map) firstChoice.get("message");
                String content = (String) message.get("content");
                return ResponseEntity.ok(content);
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("Failed to receive valid response from Groq API.");
            }

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error while reviewing code: " + e.getMessage());
        }
    }
}
