package com.vinsuite.service.qa;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.vinsuite.model.TestCase;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class VisionAIService {

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${openai.api.key}")
    private String openaiApiKey;

    private static final String OPENAI_VISION_ENDPOINT = "https://api.openai.com/v1/chat/completions";

    public List<TestCase> generateTestCasesFromImageAndFeature(byte[] imageBytes, String feature) {
        try {
            String base64Image = Base64.getEncoder().encodeToString(imageBytes);
            String imageData = "data:image/png;base64," + base64Image;

            String visionPrompt = String.format("""
                You are a QA expert. Analyze this UI screenshot and the feature below, then generate test cases.

                Feature: \"%s\"

                Format strictly as a valid JSON array:
                [
                  {
                    \"action\": \"User performs an action\",
                    \"expectedResult\": \"System should respond with...\",
                    \"actualResult\": \"\",
                    \"comments\": \"\"
                  }
                ]

                Do NOT include explanation or intro — only the JSON array.
            """, feature.trim());

            Map<String, Object> visionPayload = new HashMap<>();
            visionPayload.put("model", "gpt-4o");
            visionPayload.put("messages", List.of(
                Map.of("role", "user", "content", List.of(
                    Map.of("type", "text", "text", visionPrompt),
                    Map.of("type", "image_url", "image_url", Map.of("url", imageData))
                ))
            ));
            visionPayload.put("max_tokens", 1024);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(openaiApiKey);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(visionPayload, headers);

            ResponseEntity<Map> response = restTemplate.exchange(
                OPENAI_VISION_ENDPOINT,
                HttpMethod.POST,
                entity,
                Map.class
            );

            if (response.getStatusCode().is2xxSuccessful()) {
                Map<String, Object> responseBody = response.getBody();
                if (responseBody != null && responseBody.containsKey("choices")) {
                    List<Map<String, Object>> choices = (List<Map<String, Object>>) responseBody.get("choices");
                    if (!choices.isEmpty()) {
                        Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
                        if (message != null && message.containsKey("content")) {
                            String content = (String) message.get("content");
                            System.out.println("\uD83D\uDCC5 Raw AI content:\n" + content);
                            String json = extractJsonArray(content);
                            return Arrays.asList(objectMapper.readValue(json, TestCase[].class));
                        }
                    }
                }
            }

        } catch (Exception e) {
            e.printStackTrace();
        }

        return List.of();
    }

    private String extractJsonArray(String responseText) {
        int start = responseText.indexOf('[');
        int end = responseText.lastIndexOf(']');
        if (start != -1 && end != -1 && start < end) {
            return responseText.substring(start, end + 1);
        }
        return "[]";
    }
}