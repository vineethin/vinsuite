package com.vinsuite.controller.qa;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@RestController
@RequestMapping("/api")
public class OpenAIVisionController {

        @Value("${openai.api.key}")
        private String openAIApiKey;

        @PostMapping("/openai-xpath")
        public ResponseEntity<?> generateXPath(@RequestBody Map<String, String> payload) {
                String html = payload.get("html");
                String imageBase64 = payload.get("imageBase64");

                if (html == null || imageBase64 == null) {
                        return ResponseEntity.badRequest().body(Map.of("error", "Missing HTML or imageBase64"));
                }

                // ✅ Basic input size validation
                if (html.length() > 8000 || imageBase64.length() > 500000) {
                        return ResponseEntity.badRequest().body(
                                        Map.of("error", "Input too large. Try reducing the HTML content or screenshot size."));
                }

                // Prepare image content
                Map<String, Object> imageContent = Map.of(
                                "type", "image_url",
                                "image_url", Map.of("url", "data:image/png;base64," + imageBase64));

                // Prepare HTML content
                Map<String, Object> htmlContent = Map.of(
                                "type", "text",
                                "text", html);

                // Combine message
                List<Map<String, Object>> messages = List.of(
                                Map.of("role", "user", "content", List.of(
                                                Map.of("type", "text", "text",
                                                                "The image highlights elements in a web UI. The following HTML is the DOM. "
                                                                                +
                                                                                "Please generate XPath expressions for the marked elements using relative XPath axes like following-sibling, ancestor, etc."),
                                                imageContent,
                                                htmlContent)));

                // Compose full request body
                Map<String, Object> body = Map.of(
                                "model", "gpt-4-turbo",
                                "messages", messages,
                                "max_tokens", 500,
                                "temperature", 0.2);

                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_JSON);
                headers.setBearerAuth(openAIApiKey);

                HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

                try {
                        RestTemplate restTemplate = new RestTemplate();
                        String url = "https://api.openai.com/v1/chat/completions";

                        Map<String, Object> result = restTemplate.postForObject(url, request, Map.class);
                        if (result == null || !result.containsKey("choices")) {
                                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                                .body(Map.of("error", "Unexpected response from OpenAI"));
                        }

                        Object message = ((Map<String, Object>) ((List<?>) result.get("choices")).get(0))
                                        .get("message");
                        return ResponseEntity.ok(Map.of("output", message));

                } catch (Exception ex) {
                        ex.printStackTrace();
                        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                        .body(Map.of("error", ex.getMessage()));
                }
        }
}
