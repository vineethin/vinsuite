package com.vinsuite.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@RestController
@RequestMapping("/api/dba")
public class QueryOptimizerController {

    @Value("${groq.api.key}")
    private String groqApiKey;

    @Value("${groq.model.name}")
    private String groqModelName;

    private final RestTemplate restTemplate = new RestTemplate();

    @PostMapping("/optimize-query")
    public ResponseEntity<?> optimizeQuery(@RequestBody Map<String, String> payload) {
        String sql = payload.get("query");

        String prompt = "You are a database performance expert. Optimize the following SQL query and explain improvements:\n\n" + sql;

        try {
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", groqModelName);
            requestBody.put("messages", List.of(
                Map.of("role", "user", "content", prompt)
            ));

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(groqApiKey);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            ResponseEntity<Map> response = restTemplate.postForEntity(
                "https://api.groq.com/openai/v1/chat/completions", entity, Map.class
            );

            return ResponseEntity.ok(response.getBody());

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body(Map.of("error", e.getMessage()));
        }
    }
}
