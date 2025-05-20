package com.vinsuite.service.qa;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.vinsuite.model.TestCase;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class QAGroqAIService {

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${groq.api.key}")
    private String groqApiKey;

    @Value("${groq.model.name}")
    private String modelName;

    private static final String GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

    public Map<String, Object> generateTestCases(String featureText) {
        try {
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

            List<Map<String, String>> messages = List.of(
                    Map.of("role", "system", "content", "You are a helpful QA assistant."),
                    Map.of("role", "user", "content", prompt)
            );

            String content = sendChatCompletion(modelName, messages);
            List<TestCase> testCases = Arrays.asList(objectMapper.readValue(content, TestCase[].class));
            return Map.of("testCases", testCases);

        } catch (Exception e) {
            e.printStackTrace();
            return Map.of("testCases", Collections.emptyList());
        }
    }

    public Map<String, Object> analyzePageStructureWithAI(String html, String url) {
        try {
            String prompt = String.format("""
                    You are a UI/UX and SEO expert. Analyze the following HTML for a web page and score its structure, accessibility, and semantic use.

                    URL: %s

                    HTML:
                    %s

                    Respond strictly in JSON:
                    {
                      "aiScore": <0-100>,
                      "aiComment": "<summary of your analysis>"
                    }
                    """, url, html);

            List<Map<String, String>> messages = List.of(
                    Map.of("role", "user", "content", prompt)
            );

            String resultJson = sendChatCompletion(modelName, messages);
            return objectMapper.readValue(resultJson, Map.class);

        } catch (Exception e) {
            return Map.of(
                    "aiScore", 50,
                    "aiComment", "⚠️ Could not evaluate AI score: " + e.getMessage()
            );
        }
    }

    public Map<String, Object> summarizeBugReport(String bugReportText) {
        String prompt = """
                You are a QA assistant. Given a raw bug report, summarize it in this structured format:
                1. Summary of the bug (1–2 sentences)
                2. Affected module or feature
                3. Reproduction steps (short)
                4. Suggested severity (Low/Medium/High)
                5. AI suggestion for the cause (if any)

                Bug Report:
                \"\"\"%s\"\"\"""".formatted(bugReportText);

        List<Map<String, String>> messages = List.of(
                Map.of("role", "system", "content", "You are a helpful QA assistant."),
                Map.of("role", "user", "content", prompt)
        );

        return Map.of("summary", sendChatCompletion(modelName, messages));
    }

    public Map<String, Object> estimateCoverage(List<String> userStories, List<String> testCases, boolean deep) {
        try {
            StringBuilder sb = new StringBuilder("Evaluate test coverage:\n\nUser Stories:\n");
            for (int i = 0; i < userStories.size(); i++) {
                sb.append(i + 1).append(". ").append(userStories.get(i)).append("\n");
            }

            sb.append("\nTest Cases:\n");
            for (String tc : testCases) {
                sb.append("- ").append(tc).append("\n");
            }

            sb.append("\nOnly return a valid JSON array like:\n");
            sb.append("[{\"story\":\"...\",\"status\":\"covered|partial|missing\",\"matchedTestCases\":[\"...\"]}]\n");
            sb.append("Do not include any explanation or intro.");

            List<Map<String, String>> messages = List.of(
                    Map.of("role", "system", "content", "You are an assistant that maps user stories to test cases."),
                    Map.of("role", "user", "content", sb.toString())
            );

            String result = sendChatCompletion(modelName, messages);
            List<Map<String, Object>> parsed = objectMapper.readValue(result, List.class);
            return Map.of("coverage", parsed);

        } catch (Exception e) {
            e.printStackTrace();
            return Map.of("error", "Failed to get coverage estimation from Groq");
        }
    }

    public Map<String, Object> estimateDeepCoverage(
            List<String> userStories,
            List<List<String>> acceptanceCriteria,
            List<String> testCases,
            List<List<String>> testCaseSteps) {

        try {
            StringBuilder sb = new StringBuilder("Perform deep test coverage analysis.\n\nUser Stories:\n");
            for (int i = 0; i < userStories.size(); i++) {
                sb.append(i + 1).append(". ").append(userStories.get(i)).append("\n");
            }

            sb.append("\nAcceptance Criteria:\n");
            for (List<String> acGroup : acceptanceCriteria) {
                for (String ac : acGroup) {
                    sb.append("- ").append(ac).append("\n");
                }
            }

            sb.append("\nTest Case Titles:\n");
            for (String tc : testCases) {
                sb.append("- ").append(tc).append("\n");
            }

            sb.append("\nTest Case Steps (grouped):\n");
            for (List<String> group : testCaseSteps) {
                sb.append("Steps:\n");
                for (String step : group) {
                    sb.append(step).append("\n");
                }
                sb.append("\n");
            }

            sb.append("Return only a valid JSON array like:\n");
            sb.append("[{\"story\":\"...\",\"status\":\"covered|partial|missing\",\"matchedTestCases\":[\"...\"]}]\n");
            sb.append("Do not include any explanation or formatting.");

            List<Map<String, String>> messages = List.of(
                    Map.of("role", "system", "content", "You are an expert QA analyst."),
                    Map.of("role", "user", "content", sb.toString())
            );

            String result = sendChatCompletion(modelName, messages);
            List<Map<String, Object>> parsed = objectMapper.readValue(result, List.class);
            return Map.of("coverage", parsed);

        } catch (Exception e) {
            e.printStackTrace();
            return Map.of("error", "Failed to get deep coverage estimation from Groq");
        }
    }

    private String sendChatCompletion(String model, List<Map<String, String>> messages) {
        Map<String, Object> body = new HashMap<>();
        body.put("model", model);
        body.put("messages", messages);
        body.put("temperature", 0.4);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(groqApiKey);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<Map> response = restTemplate.exchange(GROQ_API_URL, HttpMethod.POST, entity, Map.class);
            if (response.getStatusCode().is2xxSuccessful()) {
                Map<String, Object> responseBody = response.getBody();
                List<Map<String, Object>> choices = (List<Map<String, Object>>) responseBody.get("choices");
                if (choices != null && !choices.isEmpty()) {
                    Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
                    return message.get("content").toString().trim();
                }
            }
            return "AI did not return a valid response.";
        } catch (Exception e) {
            e.printStackTrace();
            return "Error calling Groq API: " + e.getMessage();
        }
    }
}
