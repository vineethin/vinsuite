package com.vinsuite.service.dev;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.Map;

import static java.util.Map.entry;

/**
 * Service to review code using an LLM like Groq or OpenAI.
 */
@Service
public class AIReviewService {

    @Value("${groq.api.key}")
    private String apiKey;

    @Value("${groq.api.url}")
    private String apiUrl;

    @Value("${groq.model.name}")
    private String model;

    // Canonical language map to normalize frontend/backend mismatch
    private final Map<String, String> languageMap = Map.ofEntries(
            entry("javascript", "javascript"),
            entry("typescript", "typescript"),
            entry("python", "python"),
            entry("java", "java"),
            entry("c#", "csharp"),
            entry("csharp", "csharp"),
            entry("go", "go"),
            entry("php", "php"),
            entry("ruby", "ruby"),
            entry("kotlin", "kotlin"),
            entry("swift", "swift")
    );

    /**
     * Sends the provided code and language to an LLM API for detailed code review.
     *
     * @param code     the source code to review
     * @param language the programming language selected by the user
     * @return ResponseEntity with review or an error message
     */
    public ResponseEntity<String> reviewCode(String code, String language) {
        try {
            String inferred = inferLanguage(code);
            String selected = language.toLowerCase().trim();

            String canonicalInferred = languageMap.getOrDefault(inferred, inferred);
            String canonicalSelected = languageMap.getOrDefault(selected, selected);

            // Language mismatch warning
            if (!canonicalInferred.equals("unknown") && !canonicalInferred.equals(canonicalSelected)) {
                String message = String.format(
                        "The given code looks like %s, but you selected %s. Please select %s instead.",
                        canonicalInferred, canonicalSelected, canonicalInferred
                );
                return ResponseEntity.badRequest().body("// Validation Error: " + message);
            }

            // Build prompt
            String prompt = buildPrompt(code, canonicalSelected);

            JSONObject userMessage = new JSONObject()
                    .put("role", "user")
                    .put("content", prompt);

            JSONArray messages = new JSONArray().put(userMessage);

            JSONObject requestBody = new JSONObject()
                    .put("model", model)
                    .put("messages", messages)
                    .put("temperature", 0.7);

            // Send to LLM
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(apiUrl))
                    .header("Content-Type", "application/json")
                    .header("Authorization", "Bearer " + apiKey)
                    .POST(HttpRequest.BodyPublishers.ofString(requestBody.toString()))
                    .build();

            HttpClient client = HttpClient.newHttpClient();
            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() >= 200 && response.statusCode() < 300) {
                return ResponseEntity.ok(response.body());
            } else {
                return ResponseEntity.status(response.statusCode())
                        .body("// Error from LLM: " + response.body());
            }

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500)
                    .body("// Internal Error: " + e.getClass().getSimpleName() + " - " + e.getMessage());
        }
    }

    /**
     * Builds a prompt for the LLM to analyze and improve the code.
     */
    private String buildPrompt(String code, String language) {
        return String.format("""
                You are a senior software engineer performing a code review.

                Review the following %s code and:
                - Identify any bugs or logical issues
                - Suggest code quality or style improvements
                - Recommend performance optimizations
                - Note any missing best practices
                - Propose a cleaner version if possible
                - Explain why each change matters

                Code:
                ```%s```
                """, language, code);
    }

    /**
     * Attempts to infer the programming language based on common patterns.
     */
    private String inferLanguage(String code) {
        code = code.toLowerCase();

        if (code.contains("system.out.println") || code.contains("public class") || code.contains("void main"))
            return "java";
        if (code.contains("console.log") || code.contains("let ") || code.contains("function "))
            return "javascript";
        if (code.contains("def ") || code.contains("print(") || code.contains("import "))
            return "python";
        if (code.contains("using system") || code.contains("namespace") || code.contains("console.writeline"))
            return "csharp";
        if (code.contains("func ") || code.contains("package main"))
            return "go";
        if (code.contains("<?php") || code.contains("echo ") || code.contains("$"))
            return "php";
        if ((code.contains("puts ") || code.contains("def ")) && code.contains("end"))
            return "ruby";
        if (code.contains("fun main") || code.contains("val ") || code.contains("var "))
            return "kotlin";
        if (code.contains("import swift") || code.contains("let ") || code.contains("func "))
            return "swift";
        if (code.contains("type ") || code.contains("interface ") || code.contains("export "))
            return "typescript";

        return "unknown";
    }
}
