package com.vinsuite.service.writer;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class CodeSummarizerService {

    @Value("${groq.api.key}")
    private String apiKey;

    @Value("${groq.api.url}")
    private String apiUrl;

    @Value("${groq.model.name}")
    private String modelName;

    public String summarizeCode(String code) {
        try {
            String prompt = String.format("""
                You're an expert code reviewer. Please summarize the code below:
                - Purpose of the code
                - Main functions/components
                - Any clever logic
                - Suggested improvements
                - Helpful comments

                Code:
                ```%s```
                """, code);

            JSONObject userMessage = new JSONObject()
                    .put("role", "user")
                    .put("content", prompt);

            JSONArray messages = new JSONArray().put(userMessage);

            JSONObject payload = new JSONObject()
                    .put("model", modelName)
                    .put("messages", messages)
                    .put("temperature", 0.4)
                    .put("max_tokens", 1000);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(apiUrl))
                    .header("Content-Type", "application/json")
                    .header("Authorization", "Bearer " + apiKey)
                    .POST(HttpRequest.BodyPublishers.ofString(payload.toString()))
                    .build();

            HttpClient client = HttpClient.newHttpClient();
            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

            String responseBody = response.body();
            JSONObject json = new JSONObject(responseBody);

            if (json.has("choices")) {
                JSONArray choices = json.getJSONArray("choices");
                if (choices.length() > 0) {
                    return choices.getJSONObject(0)
                            .getJSONObject("message")
                            .getString("content")
                            .trim();
                }
            }

            return "❌ No valid summary returned. Raw response:\n" + responseBody;

        } catch (Exception e) {
            e.printStackTrace();
            return "⚠️ Error occurred while summarizing code: " + e.getMessage();
        }
    }
}
