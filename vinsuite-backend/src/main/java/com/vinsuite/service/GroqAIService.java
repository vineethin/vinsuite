package com.vinsuite.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.vinsuite.model.TestCase;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class GroqAIService {

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${groq.api.key}")
    private String groqApiKey;

    private static final String GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

    public Map<String, Object> generateTestCases(String featureText) {
        try {
            // Dynamic prompt: no limit on number of test cases
            String prompt = """
                You are a QA expert. Based on the feature below, generate as many valid test cases as necessary.

                Feature: "%s"

                Format your response strictly as a valid JSON array:
                [
                  {
                    "action": "User performs an action",
                    "expectedResult": "System should respond with...",
                    "actualResult": "",
                    "comments": ""
                  }
                ]

                Do NOT include any explanation, intro, or text — only the pure JSON array.
            """.formatted(featureText.trim());

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(groqApiKey);

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", "llama3-70b-8192");
            requestBody.put("messages", List.of(
                    Map.of("role", "system", "content", "You are a helpful QA assistant."),
                    Map.of("role", "user", "content", prompt)
            ));

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            ResponseEntity<Map> response = restTemplate.exchange(
                    GROQ_API_URL,
                    HttpMethod.POST,
                    entity,
                    Map.class
            );

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                List<Map<String, Object>> choices = (List<Map<String, Object>>) response.getBody().get("choices");
                if (choices != null && !choices.isEmpty()) {
                    Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
                    String content = (String) message.get("content");

                    List<TestCase> testCases = Arrays.asList(objectMapper.readValue(content, TestCase[].class));
                    return Map.of("testCases", testCases);
                }
            }

        } catch (Exception e) {
            e.printStackTrace();
        }

        return Map.of("testCases", Collections.emptyList());
    }
}
