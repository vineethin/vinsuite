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
            objectMapper.configure(com.fasterxml.jackson.core.JsonParser.Feature.ALLOW_COMMENTS, true);

            // ✅ Step 1: Locate start of JSON (array or object)
            int bracketStart = content.indexOf('[');
            int braceStart = content.indexOf('{');

            int jsonStart = -1;
            if (bracketStart >= 0 && (braceStart == -1 || bracketStart < braceStart)) {
                jsonStart = bracketStart;
            } else if (braceStart >= 0) {
                jsonStart = braceStart;
            }

            if (jsonStart < 0 || jsonStart >= content.length()) {
                System.out.println("⚠️ No JSON start found.");
                System.out.println("Raw content: " + content);
                return List.of();
            }

            // ✅ Step 2: Extract the JSON-ish part
            String jsonOnly = content.substring(jsonStart).trim();

            // ✅ Step 3: Remove Groq-style artifacts
            // ✅ Step 3: Remove Groq-style artifacts and fix broken locator quotes
            jsonOnly = jsonOnly
                    .replaceAll("(?m)^\\s*//.*?$", "") // Remove // comments
                    .replaceAll("(?s)/\\*.*?\\*/", "") // Remove /* */ block comments
                    .replace("&quot;", "\"")
                    .replace("&apos;", "'")
                    .replaceAll("xpath\\(\\\"(.*?)\\\"\\)", "xpath('$1')") // Fix double-quoted xpath to single-quoted
                    .replaceAll("id\\(\\\"(.*?)\\\"\\)", "id('$1')")
                    .replaceAll("css\\(\\\"(.*?)\\\"\\)", "css('$1')")
                    .replaceAll("label\\(\\\"(.*?)\\\"\\)", "label('$1')");

            // ✅ Step 4: Handle partially clipped Groq output
            if (jsonOnly.startsWith("[")) {
                int lastObjectClose = jsonOnly.lastIndexOf("}");
                if (lastObjectClose != -1) {
                    jsonOnly = jsonOnly.substring(0, lastObjectClose + 1).trim();
                    if (!jsonOnly.endsWith("]")) {
                        jsonOnly += "]";
                        System.out.println("⚠️ JSON array was not closed. Appended closing bracket.");
                    }
                } else {
                    System.out.println("⚠️ JSON starts with [ but no object found.");
                    return List.of();
                }
            }

            // ✅ Step 5: Wrap in array if it's a single object
            if (!jsonOnly.startsWith("[") && jsonOnly.startsWith("{")) {
                jsonOnly = "[" + jsonOnly + "]";
                System.out.println("ℹ️ Wrapped single object in array brackets.");
            }

            // ✅ Step 6: Debug print final sanitized JSON
            System.out.println("📦 Sanitized JSON:\n" + jsonOnly);

            // ✅ Step 7: Parse into List<TestCase>
            List<TestCase> parsed = Arrays.asList(objectMapper.readValue(jsonOnly, TestCase[].class));
            System.out.println("✅ Parsed " + parsed.size() + " test case(s).");
            return parsed;

        } catch (Exception e) {
            System.out.println("❌ JSON parsing failed in parseGroqJsonToTestCases.");
            System.out.println("Input:\n" + content);
            e.printStackTrace();
        }

        return List.of();
    }

    public String callGroqRaw(String prompt) {
        try {
            if (prompt.length() > 15000) {
                prompt = prompt.substring(0, 14950) + "\n\n(Note: prompt truncated due to size limit)";
                System.out.println("⚠️ Prompt was truncated due to size limits.");
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
            Thread.sleep(3000); // Replace with WebDriverWait in production

            String html = driver.getPageSource();
            if (html == null || html.isBlank()) {
                System.out.println("⚠️ Failed to extract HTML content.");
                return List.of();
            }

            html = cleanAndCompressHtml(html);

            String prompt = """
                    You are a senior QA engineer.

                    Functionality: %s

                    Based on the HTML below, generate Selenium-style test cases categorized as positive, negative, or edge.

                    🛠️ Rules:
                    - Use {{USERNAME}} and {{PASSWORD}} as placeholders for login input values.
                    - Derive locators from the actual HTML provided.
                    - Use only these locator formats: xpath(\"...\"), id(\"...\"), css(\"...\"), or label(\"...\").
                    - Inside XPath and other locators, always use double quotes.
                    - DO NOT include hardcoded values like 'standard_user' or 'secret_sauce'.

                    🔒 Output format (return only the JSON array — no explanation, no headings):
                    [
                      {
                        "action": "Enter {{USERNAME}} in xpath(\"//input[@id='user-name']\") and {{PASSWORD}} in xpath(\"//input[@id='password']\") and click on xpath(\"//input[@id='login-button']\")",
                        "expectedResult": "Login is successful",
                        "actualResult": "",
                        "comments": "positive"
                      }
                    ]

                    HTML:
                    %s
                    """
                    .formatted(functionality, html);

            String responseBody = callGroqRaw(prompt);

            System.out.println("🔍 Groq response for functionality '" + functionality + "':\n" + responseBody);

            // Final sanitization fix for Groq returning wrong quotes
            String sanitizedResponse = responseBody
                    .replaceAll("\\\\'", "'");

            List<TestCase> parsed = parseGroqJsonToTestCases(sanitizedResponse);
            System.out.println("✅ Parsed " + parsed.size() + " test case(s) successfully.");
            return parsed;

        } catch (InterruptedException ie) {
            Thread.currentThread().interrupt();
            System.out.println("⛔ Thread was interrupted.");
            return List.of();
        } catch (Exception e) {
            System.out.println("❌ Exception in generateCategorizedTests(): " + e.getMessage());
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
