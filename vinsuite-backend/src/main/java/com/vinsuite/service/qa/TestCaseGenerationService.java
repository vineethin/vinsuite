// ✅ Fully Groq-Powered TestCaseGenerationService.java

package com.vinsuite.service.qa;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.vinsuite.dto.qa.SmartTestCaseRequest;
import com.vinsuite.model.TestCase;
import net.sourceforge.tess4j.ITesseract;
import net.sourceforge.tess4j.Tesseract;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.util.*;

@Service
public class TestCaseGenerationService {

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${groq.api.key}")
    private String groqApiKey;

    public ResponseEntity<?> generateTestCasesFromText(Map<String, String> request) {
        try {
            String extractedText = request.get("feature");
            String prompt = buildPrompt(extractedText);
            List<TestCase> testCases = callGroqToGenerateTestCases(prompt);
            return ResponseEntity.ok(Map.of("testCases", testCases));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Test case generation failed"));
        }
    }

    public ResponseEntity<?> generateSmartTestCasesFromImage(SmartTestCaseRequest request) {
        try {
            String featureText = Optional.ofNullable(request.getFeatureText()).orElse("").trim();
            String imageBase64 = Optional.ofNullable(request.getImageBase64()).orElse("").trim();

            String extractedText = "";

            if (!imageBase64.isEmpty() && imageBase64.contains(",")) {
                String base64Data = imageBase64.split(",")[1];
                byte[] imageBytes = Base64.getDecoder().decode(base64Data);
                BufferedImage bufferedImage = ImageIO.read(new ByteArrayInputStream(imageBytes));
                if (bufferedImage != null) {
                    ITesseract tesseract = new Tesseract();
                    tesseract.setDatapath("C:\\Program Files\\Tesseract-OCR\\tessdata");
                    extractedText = tesseract.doOCR(bufferedImage);
                    System.out.println("🧾 Extracted OCR Text: " + extractedText);
                }
            }

            if (featureText.isEmpty() && extractedText.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "No valid input provided"));
            }

            String prompt = String.format("""
                You are a senior QA engineer.

                %s
                %s

                Based on the available input, generate exactly 4 test cases ONLY.
                [
                  {
                    "action": "User does something",
                    "expectedResult": "Expected outcome",
                    "actualResult": "",
                    "comments": ""
                  }
                ]
                Only return the JSON array — no extra explanation.
            """,
                !featureText.isEmpty() ? "User Story:\n" + featureText : "",
                !extractedText.isEmpty() ? "UI OCR Extract:\n" + extractedText : ""
            );

            List<TestCase> testCases = callGroqToGenerateTestCases(prompt);
            return ResponseEntity.ok(Map.of("testCases", testCases));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Smart test case generation failed", "details", e.getMessage()));
        }
    }

    private List<TestCase> callGroqToGenerateTestCases(String prompt) {
        Map<String, Object> payload = new HashMap<>();
        payload.put("model", "llama3-70b-8192");
        payload.put("messages", List.of(Map.of("role", "user", "content", prompt)));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(groqApiKey);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(payload, headers);

        try {
            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                    "https://api.groq.com/openai/v1/chat/completions",
                    HttpMethod.POST,
                    entity,
                    new ParameterizedTypeReference<>() {}
            );

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                Map<String, Object> responseBody = response.getBody();
                Object choicesObj = responseBody.get("choices");
                if (choicesObj instanceof List<?> choicesList && !choicesList.isEmpty()) {
                    Object choice = choicesList.get(0);
                    if (choice instanceof Map<?, ?> choiceMap) {
                        Object messageObj = choiceMap.get("message");
                        if (messageObj instanceof Map<?, ?> messageMap) {
                            Object contentObj = messageMap.get("content");
                            if (contentObj instanceof String content) {
                                return Arrays.asList(objectMapper.readValue(content, TestCase[].class));
                            }
                        }
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return new ArrayList<>();
    }

    private String buildPrompt(String extractedText) {
        return """
            You are a senior QA engineer.

            Here is the OCR text extracted from a login screen:
            \"\"\" %s \"\"\"

            Please generate exactly 4 test cases ONLY based on the OCR text above.
            DO NOT assume any features or buttons that are not clearly present in the OCR.
            Each test case must follow this JSON structure strictly:
            [
              {
                "action": "User performs an action visible in the OCR",
                "expectedResult": "What the system should do",
                "actualResult": "",
                "comments": ""
              }
            ]

            Only respond with the JSON array — no headings, no explanation.
        """.formatted(extractedText.trim());
    }
}