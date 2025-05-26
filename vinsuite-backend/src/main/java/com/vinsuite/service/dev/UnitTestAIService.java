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

    @Value("${groq.model.name}")
    private String groqModelName;

    private static final String GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

    public String generateTestCode(String prompt) {
        RestTemplate restTemplate = new RestTemplate();
    
        Map<String, Object> message = Map.of(
            "role", "user",
            "content", prompt
        );
    
        Map<String, Object> requestBody = Map.of(
            "model", groqModelName,
            "messages", List.of(message),
            "temperature", 0.3
        );
    
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(groqApiKey);
    
        HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);
    
        try {
            ResponseEntity<Map> response = restTemplate.exchange(GROQ_API_URL, HttpMethod.POST, request, Map.class);
    
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                List<Map<String, Object>> choices = (List<Map<String, Object>>) response.getBody().get("choices");
                if (choices != null && !choices.isEmpty()) {
                    Map<String, Object> messageResult = (Map<String, Object>) choices.get(0).get("message");
                    if (messageResult != null && messageResult.containsKey("content")) {
                        return (String) messageResult.get("content");
                    }
                }
            }
    
            return "// Error: No response content from Groq";
        } catch (Exception e) {
            e.printStackTrace();  // ✅ Log the real issue in logs
            return "// Error: Exception occurred while calling Groq - " + e.getMessage();
        }
    }
    
}
