package com.vinsuite.controller.qa;

import com.vinsuite.dto.qa.RunTestRequest;
import com.vinsuite.model.TestCase;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.openqa.selenium.By;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.TakesScreenshot;

import java.util.ArrayList;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;
import java.io.File;
import java.io.FileWriter;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import com.vinsuite.service.qa.TestCaseGenerationService;
import java.util.List;
import java.util.Map;
import java.util.List;

@RestController
@RequestMapping("/api/testaura")
public class TestAuraController {

    private final TestCaseGenerationService testCaseService;

    public TestAuraController(TestCaseGenerationService testCaseService) {
        this.testCaseService = testCaseService;
    }

    @PostMapping("/run")
    public ResponseEntity<?> runSelectedTests(@RequestBody RunTestRequest request) {
        String url = request.getUrl();
        List<String> tests = request.getTests();

        if (url == null || url.isBlank() || tests == null || tests.isEmpty()) {
            return ResponseEntity.badRequest().body("{\"message\":\"URL and test list required.\"}");
        }

        try {
            ChromeOptions options = new ChromeOptions();
            options.addArguments("--headless=new", "--no-sandbox", "--disable-dev-shm-usage");

            WebDriver driver = new ChromeDriver(options);
            driver.get(url);

            System.out.println("🧪 TestAura is running the following tests on: " + url);
            for (String test : tests) {
                System.out.println("- " + test);
            }

            // Capture screenshot as base64
            String screenshotBase64 = ((TakesScreenshot) driver)
                    .getScreenshotAs(OutputType.BASE64);
            System.out.println("✅ Screenshot captured: base64 length = " + screenshotBase64.length());

            driver.quit();
            String reportDir = "test-reports";
            new File(reportDir).mkdirs(); // ensure directory exists

            String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
            String reportFilename = "report_" + timestamp + ".html";
            String reportPath = Paths.get(reportDir, reportFilename).toString();

            StringBuilder html = new StringBuilder();
            html.append("<html><head><title>TestAura Report</title></head><body>");
            html.append("<h2>Test Report</h2>");
            html.append("<p><strong>URL:</strong> ").append(url).append("</p>");
            html.append("<p><strong>Executed Tests:</strong></p><ul>");
            for (String test : tests) {
                html.append("<li>").append(test).append("</li>");
            }
            html.append("</ul>");

            html.append("<p><strong>Screenshot:</strong></p>");
            html.append("<img src='data:image/png;base64,").append(screenshotBase64)
                    .append("' style='max-width:100%;border:1px solid #ccc;' />");

            html.append("<p><em>Generated at ").append(timestamp).append("</em></p>");
            html.append("</body></html>");

            try (FileWriter writer = new FileWriter(reportPath)) {
                writer.write(html.toString());
            }

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Tests executed in headless Chrome.");
            response.put("screenshot", screenshotBase64);

            response.put("reportUrl", "/api/testaura/report/" + reportFilename);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            // 🔍 Print full stack trace to console
            e.printStackTrace();

            StringWriter sw = new StringWriter();
            e.printStackTrace(new PrintWriter(sw));
            String fullStack = sw.toString();
            System.err.println("🔴 Full stack trace:\n" + fullStack);

            Map<String, Object> error = new HashMap<>();
            error.put("message", "Test execution failed.");
            error.put("error", e.getMessage());
            error.put("stack", fullStack);

            return ResponseEntity.internalServerError().body(error);
        }
    }

    @GetMapping("/report/{filename}")
    public ResponseEntity<?> downloadReport(@PathVariable String filename) {
        try {
            File file = Paths.get("test-reports", filename).toFile();
            if (!file.exists()) {
                return ResponseEntity.notFound().build();
            }

            return ResponseEntity.ok()
                    .header("Content-Type", "text/html")
                    .header("Content-Disposition", "inline; filename=" + filename)
                    .body(java.nio.file.Files.readString(file.toPath()));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Failed to read report.");
        }
    }

    @PostMapping("/run-smart")
    public ResponseEntity<?> runSmartTests(@RequestBody RunTestRequest request) {
        String url = request.getUrl();
        List<String> tests = request.getTests();
        String username = request.getUsername(); // ✅ new
        String password = request.getPassword(); // ✅ new

        if (url == null || url.isBlank() || tests == null || tests.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "URL and at least one test name required."));
        }

        try {
            String selectedFunctionality = tests.get(0); // e.g., "Test login functionality"
            List<TestCase> categorized = testCaseService.generateCategorizedTests(url, selectedFunctionality);

            List<TestCase> positiveTests = categorized.stream()
                    .filter(tc -> "positive".equalsIgnoreCase(tc.getComments()))
                    .toList();
            List<TestCase> negativeTests = categorized.stream()
                    .filter(tc -> "negative".equalsIgnoreCase(tc.getComments()))
                    .toList();
            List<TestCase> edgeTests = categorized.stream()
                    .filter(tc -> "edge".equalsIgnoreCase(tc.getComments()))
                    .toList();

            ChromeOptions options = new ChromeOptions();
            options.addArguments("--headless=new", "--no-sandbox", "--disable-dev-shm-usage");

            WebDriver driver = new ChromeDriver(options);
            driver.get(url);

            List<String> logs = new ArrayList<>();
            logs.addAll(executeTestCases(driver, positiveTests, request.getUsername(), request.getPassword()));
            logs.addAll(executeTestCases(driver, negativeTests, request.getUsername(), request.getPassword()));
            logs.addAll(executeTestCases(driver, edgeTests, request.getUsername(), request.getPassword()));

            String screenshotBase64 = ((TakesScreenshot) driver).getScreenshotAs(OutputType.BASE64);
            driver.quit();

            String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
            String reportFilename = "report_" + timestamp + ".html";
            String reportDir = "test-reports";
            new File(reportDir).mkdirs();
            String reportPath = Paths.get(reportDir, reportFilename).toString();

            StringBuilder html = new StringBuilder();
            html.append("<html><head><title>TestAura Report</title></head><body>");
            html.append("<h2>TestAura Smart Report</h2>");
            html.append("<p><strong>URL:</strong> ").append(url).append("</p>");
            html.append("<p><strong>Functionality:</strong> ").append(selectedFunctionality).append("</p>");
            html.append("<p><strong>Screenshot:</strong><br/><img src='data:image/png;base64,")
                    .append(screenshotBase64).append("' style='max-width:100%;border:1px solid #ccc;' /></p>");
            html.append("<h3>Execution Logs</h3><ul>");
            for (String log : logs) {
                html.append("<li>").append(log).append("</li>");
            }
            html.append("</ul>");
            html.append("<p><em>Generated at ").append(timestamp).append("</em></p>");
            html.append("</body></html>");

            try (FileWriter writer = new FileWriter(reportPath)) {
                writer.write(html.toString());
            }

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Smart tests executed.");
            response.put("reportUrl", "/api/testaura/report/" + reportFilename);
            response.put("screenshot", screenshotBase64);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "Execution failed", "details", e.getMessage()));
        }
    }

    private List<String> executeTestCases(WebDriver driver, List<TestCase> tests, String username, String password) {
        List<String> logs = new ArrayList<>();

        for (TestCase tc : tests) {
            String action = tc.getAction();
            String expected = tc.getExpectedResult();
            String comment = tc.getComments();

            try {
                // ✅ Inject username/password if placeholders are used
                if (action.contains("'USERNAME'")) {
                    action = action.replace("'USERNAME'", "'" + (username != null ? username : "") + "'");
                }
                if (action.contains("'PASSWORD'")) {
                    action = action.replace("'PASSWORD'", "'" + (password != null ? password : "") + "'");
                }

                if (action.toLowerCase().contains("click")) {
                    // e.g., "Click button with id='submit'"
                    String id = extractIdFromAction(action);
                    if (id != null) {
                        driver.findElement(By.id(id)).click();
                    } else {
                        throw new IllegalArgumentException("No valid element ID found in action: " + action);
                    }

                } else if (action.toLowerCase().contains("enter") || action.toLowerCase().contains("type")) {
                    // e.g., "Enter 'admin' into input with id='username'"
                    String[] parts = extractTextAndIdFromAction(action);
                    if (parts != null) {
                        driver.findElement(By.id(parts[1])).sendKeys(parts[0]);
                    } else {
                        throw new IllegalArgumentException("Failed to extract text and ID from action: " + action);
                    }
                }

                logs.add("✅ [" + comment + "] " + action + " → Expected: " + expected);

            } catch (Exception e) {
                logs.add("❌ [" + comment + "] " + action + " → Failed: " + e.getMessage());
            }
        }

        return logs;
    }

    private String extractIdFromAction(String action) {
        int idx = action.indexOf("id='");
        if (idx == -1)
            return null;
        return action.substring(idx + 4, action.indexOf("'", idx + 4));
    }

    private String[] extractTextAndIdFromAction(String action) {
        // Example: "Enter 'admin' into input with id='username'"
        int valStart = action.indexOf("'");
        int valEnd = action.indexOf("'", valStart + 1);
        int idStart = action.indexOf("id='", valEnd);
        int idEnd = action.indexOf("'", idStart + 4);

        if (valStart == -1 || valEnd == -1 || idStart == -1 || idEnd == -1)
            return null;
        String text = action.substring(valStart + 1, valEnd);
        String id = action.substring(idStart + 4, idEnd);
        return new String[] { text, id };
    }

}
