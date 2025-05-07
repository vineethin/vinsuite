// src/main/java/com/vinsuite/service/dev/UnitTestAIService.java
package com.vinsuite.service.dev;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
public class UnitTestAIService {

    @Value("${groq.api.key}")
    private String groqApiKey;

    private static final String GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
    private static final String MODEL = "llama3-70b-8192";  // Or mixtral if you prefer

    public String generateTestCode(String prompt) {
        RestTemplate restTemplate = new RestTemplate();

        Map<String, Object> message = Map.of(
            "role", "user",
            "content", prompt
        );

        Map<String, Object> requestBody = Map.of(
            "model", MODEL,
            "messages", List.of(message),
            "temperature", 0.3
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(groqApiKey);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);
        ResponseEntity<Map> response = restTemplate.exchange(GROQ_API_URL, HttpMethod.POST, request, Map.class);

        Map completion = (Map) ((List) response.getBody().get("choices")).get(0);
        Map messageResult = (Map) completion.get("message");

        return (String) messageResult.get("content");
    }
}
