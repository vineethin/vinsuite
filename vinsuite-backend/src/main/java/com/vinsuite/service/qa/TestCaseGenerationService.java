// ✅ Fully Groq-Powered TestCaseGenerationService.java

package com.vinsuite.service.qa;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.type.TypeReference;

import com.vinsuite.dto.qa.SmartTestCaseRequest;
import com.vinsuite.model.TestCase;

import io.github.bonigarcia.wdm.WebDriverManager;
import net.sourceforge.tess4j.ITesseract;
import net.sourceforge.tess4j.Tesseract;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.*;

@Service
public class TestCaseGenerationService {

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${groq.api.key}")
    private String groqApiKey;

    @Value("${groq.model.name}")
    private String groqModelName;

    @Value("${groq.api.url}")
    private String groqApiUrl;

    @Value("${tesseract.data.path}")
    private String tessDataPath;

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
                    tesseract.setDatapath(tessDataPath);
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
                    !extractedText.isEmpty() ? "UI OCR Extract:\n" + extractedText : "");

            List<TestCase> testCases = callGroqToGenerateTestCases(prompt);
            return ResponseEntity.ok(Map.of("testCases", testCases));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Smart test case generation failed", "details", e.getMessage()));
        }
    }

    public List<TestCase> callGroqToGenerateTestCases(String prompt) {
        String raw = callGroqRaw(prompt);
        return parseGroqJsonToTestCases(raw);
    }

    public List<TestCase> parseGroqJsonToTestCases(String content) {
        try {
            int startBracket = content.indexOf("[");
            int startBrace = content.indexOf("{");
            int jsonStart = (startBracket >= 0 && (startBracket < startBrace || startBrace == -1)) ? startBracket
                    : startBrace;

            if (jsonStart < 0) {
                System.out.println("⚠️ No JSON start found.");
                return List.of();
            }

            String jsonOnly = content.substring(jsonStart).trim();
            System.out.println("📦 JSON Only Extracted:\n" + jsonOnly);

            if (jsonOnly.startsWith("[")) {
                try {
                    List<TestCase> parsed = Arrays.asList(objectMapper.readValue(jsonOnly, TestCase[].class));
                    System.out.println("✅ Successfully parsed TestCase[]: " + parsed.size());
                    return parsed;
                } catch (Exception inner) {
                    System.out.println("❌ Failed to parse as TestCase[]. Falling back to string titles.");
                    inner.printStackTrace();

                    List<String> titles = objectMapper.readValue(jsonOnly, new TypeReference<List<String>>() {
                    });
                    return titles.stream().map(t -> {
                        TestCase tc = new TestCase();
                        tc.setAction(t);
                        tc.setExpectedResult("");
                        tc.setActualResult("");
                        tc.setComments("");
                        return tc;
                    }).toList();
                }
            }

            // other branch omitted for brevity...

        } catch (Exception e) {
            System.out.println("❌ Final fallback: parsing error.");
            e.printStackTrace();
        }

        return List.of();
    }

    public String callGroqRaw(String prompt) {
        try {
            if (prompt.length() > 15000) {
                prompt = prompt.substring(0, 14950) + "\n\n(Note: prompt truncated due to size limit)";
            }

            Map<String, Object> payload = new HashMap<>();
            payload.put("model", groqModelName);
            payload.put("messages", List.of(Map.of("role", "user", "content", prompt)));

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(groqApiKey);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(payload, headers);

            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                    groqApiUrl,
                    HttpMethod.POST,
                    entity,
                    new ParameterizedTypeReference<>() {
                    });

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                Map<String, Object> responseBody = response.getBody();
                List<?> choices = (List<?>) responseBody.get("choices");
                if (!choices.isEmpty() && choices.get(0) instanceof Map<?, ?> choice) {
                    Object message = choice.get("message");
                    if (message instanceof Map<?, ?> msgMap) {
                        Object content = msgMap.get("content");
                        if (content instanceof String contentStr) {
                            return contentStr;
                        }
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return "";
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

    public List<TestCase> generateCategorizedTests(String url, String functionality) {
        WebDriver driver = null;
        try {
            WebDriverManager.chromedriver().setup();
            ChromeOptions options = new ChromeOptions();
            options.addArguments("--headless=new", "--disable-gpu", "--no-sandbox", "--disable-dev-shm-usage");
            driver = new ChromeDriver(options);
            driver.get(url);
            Thread.sleep(3000);

            String html = driver.getPageSource();
            html = cleanAndCompressHtml(html); // Keep this if you use compression

            String prompt = """
                        You are a senior QA engineer.

                        Functionality: %s

                        Based on the HTML provided below, generate Selenium-style test cases categorized as positive, negative, or edge.

                        HTML:
                        %s

                        Each test case must strictly follow this JSON format:
                        {
                          "action": "User action",
                          "expectedResult": "Expected output",
                          "actualResult": "",
                          "comments": "positive | negative | edge"
                        }

                        Only return a JSON array of 6 to 9 test cases — no explanations, no extra text.
                    """
                    .formatted(functionality, html);

            // 🔥 Add debug logging
            String responseBody = callGroqRaw(prompt);
            System.out.println("🔍 Groq response for " + functionality + ":\n" + responseBody);

            List<TestCase> parsed = parseGroqJsonToTestCases(responseBody);
            System.out.println("✅ Parsed " + parsed.size() + " test cases");
            return parsed;

        } catch (Exception e) {
            e.printStackTrace();
            return List.of();
        } finally {
            if (driver != null) {
                driver.quit();
            }
        }
    }

    public String cleanAndCompressHtml(String html) {
        if (html == null || html.isBlank())
            return "";

        html = html.replaceAll("(?s)<script.*?>.*?</script>", "");
        html = html.replaceAll("(?s)<style.*?>.*?</style>", "");
        html = html.replaceAll("(?s)<!--.*?-->", "");
        html = html.replaceAll("\\s+", " ");

        final int MAX_LENGTH = 8000;
        return html.length() > MAX_LENGTH ? html.substring(0, MAX_LENGTH) : html;
    }

}
