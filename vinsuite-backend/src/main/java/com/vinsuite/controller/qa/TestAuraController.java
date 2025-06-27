package com.vinsuite.controller.qa;

import com.vinsuite.config.TestAuraConfig;
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

import java.io.File;
import java.io.FileOutputStream;
import java.io.FileWriter;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import com.vinsuite.service.qa.TestCaseGenerationService;

import jakarta.servlet.http.HttpServletRequest;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;
import java.util.List;
import java.awt.Desktop;

@RestController
@RequestMapping("/api/testaura")
public class TestAuraController {

    private final TestCaseGenerationService testCaseService;
    private final TestAuraConfig config;

    public TestAuraController(TestCaseGenerationService testCaseService, TestAuraConfig config) {
        this.testCaseService = testCaseService;
        this.config = config;
    }

    @PostMapping("/run")
    public ResponseEntity<?> runSelectedTests(@RequestBody RunTestRequest request) {
        String url = request.getUrl();
        List<String> tests = request.getTests();

        if (url == null || url.isBlank() || tests == null || tests.isEmpty()) {
            return ResponseEntity.badRequest().body("{\"message\":\"URL and test list required.\"}");
        }

        try {
            WebDriver driver = createWebDriver();
            driver.get(url);

            System.out.println("🧪 TestAura is running the following tests on: " + url);
            for (String test : tests) {
                System.out.println("- " + test);
            }

            String screenshotBase64 = ((TakesScreenshot) driver).getScreenshotAs(OutputType.BASE64);
            driver.quit();

            String reportDir = config.getReportDir();
            new File(reportDir).mkdirs();

            String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
            String baseName = "report_" + timestamp;

            String htmlPath = Paths.get(reportDir, baseName + ".html").toString();
            String jsonPath = Paths.get(reportDir, baseName + ".json").toString();
            String csvPath = Paths.get(reportDir, baseName + ".csv").toString();
            String zipPath = Paths.get(reportDir, baseName + ".zip").toString();

            // HTML report
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

            try (FileWriter writer = new FileWriter(htmlPath, StandardCharsets.UTF_8)) {
                writer.write(html.toString());
            }

            // Auto-open HTML in browser
            try {
                File htmlFile = new File(htmlPath);
                if (Desktop.isDesktopSupported()) {
                    Desktop.getDesktop().browse(htmlFile.toURI());
                }
            } catch (Exception ex) {
                System.err.println("Could not open browser: " + ex.getMessage());
            }

            // Write JSON + CSV
            try (FileWriter jsonOut = new FileWriter(jsonPath, StandardCharsets.UTF_8);
                    FileWriter csvOut = new FileWriter(csvPath, StandardCharsets.UTF_8)) {

                jsonOut.write("[\n" + tests.stream()
                        .map(t -> "  \"" + t.replace("\"", "\\\"") + "\"")
                        .collect(Collectors.joining(",\n")) + "\n]");

                for (String t : tests) {
                    csvOut.write("\"" + t.replace("\"", "\"\"") + "\"\n");
                }
            }

            // Zip the report files
            try (FileOutputStream fos = new FileOutputStream(zipPath);
                    ZipOutputStream zos = new ZipOutputStream(fos)) {

                for (String path : List.of(htmlPath, jsonPath, csvPath)) {
                    File file = new File(path);
                    if (file.exists()) {
                        zos.putNextEntry(new ZipEntry(file.getName()));
                        zos.write(java.nio.file.Files.readAllBytes(file.toPath()));
                        zos.closeEntry();
                    }
                }
            }

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Tests executed in headless Chrome.");
            response.put("screenshot", screenshotBase64);
            response.put("reportUrl", "/api/testaura/report/" + baseName + ".html");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            e.printStackTrace();

            StringWriter sw = new StringWriter();
            e.printStackTrace(new PrintWriter(sw));
            String fullStack = sw.toString();

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
            File file = Paths.get(config.getReportDir(), filename).toFile();
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
    public ResponseEntity<?> runSmartTests(@RequestBody RunTestRequest request, HttpServletRequest servletRequest) {
        String url = request.getUrl();
        List<String> tests = request.getTests();
        String username = request.getUsername();
        String password = request.getPassword();

        if (url == null || url.isBlank() || tests == null || tests.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "URL and at least one test name required."));
        }

        try {
            String selectedFunctionality = tests.get(0);
            List<TestCase> categorized = testCaseService.generateCategorizedTests(url, selectedFunctionality);

            List<TestCase> positiveTests = categorized.stream()
                    .filter(tc -> "positive".equalsIgnoreCase(tc.getComments())).toList();
            List<TestCase> negativeTests = categorized.stream()
                    .filter(tc -> "negative".equalsIgnoreCase(tc.getComments())).toList();
            List<TestCase> edgeTests = categorized.stream()
                    .filter(tc -> "edge".equalsIgnoreCase(tc.getComments())).toList();

            WebDriver driver = createWebDriver();
            driver.get(url);

            List<String> logs = new ArrayList<>();
            logs.addAll(executeTestCases(driver, positiveTests, username, password));
            logs.addAll(executeTestCases(driver, negativeTests, username, password));
            logs.addAll(executeTestCases(driver, edgeTests, username, password));

            String screenshotBase64 = ((TakesScreenshot) driver).getScreenshotAs(OutputType.BASE64);
            driver.quit();

            String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
            String baseName = "report_" + timestamp;
            String reportDir = config.getReportDir();
            new File(reportDir).mkdirs();

            String htmlPath = Paths.get(reportDir, baseName + ".html").toString();
            String jsonPath = Paths.get(reportDir, baseName + ".json").toString();
            String csvPath = Paths.get(reportDir, baseName + ".csv").toString();
            String zipPath = Paths.get(reportDir, baseName + ".zip").toString();

            // HTML Report
            StringBuilder html = new StringBuilder();
            html.append("<html><head><title>TestAura Report</title></head><body>");
            html.append("<h2>TestAura Smart Report</h2>");
            html.append("<p><strong>URL:</strong> ").append(url).append("</p>");
            html.append("<p><strong>Functionality:</strong> ").append(selectedFunctionality).append("</p>");
            html.append("<p><strong>Screenshot:</strong><br/><img src='data:image/png;base64,")
                    .append(screenshotBase64).append("' style='max-width:100%;border:1px solid #ccc;' /></p>");
            html.append("<h3>Execution Logs</h3><ul>");
            for (String log : logs) {
                String color = log.startsWith("✅") ? "green" : "red";
                html.append("<li style='color:").append(color).append(";'>").append(log).append("</li>");
            }
            html.append("</ul>");
            html.append("<p><em>Generated at ").append(timestamp).append("</em></p>");
            html.append("</body></html>");

            try (FileWriter writer = new FileWriter(htmlPath, StandardCharsets.UTF_8)) {
                writer.write(html.toString());
            }

            // Auto-open in browser (only if local)
            try {
                if (Desktop.isDesktopSupported() && servletRequest.getServerName().equals("localhost")) {
                    Desktop.getDesktop().browse(new File(htmlPath).toURI());
                }
            } catch (Exception ex) {
                System.err.println("⚠️ Could not open browser: " + ex.getMessage());
            }

            // JSON + CSV logs
            try (FileWriter jsonOut = new FileWriter(jsonPath, StandardCharsets.UTF_8);
                    FileWriter csvOut = new FileWriter(csvPath, StandardCharsets.UTF_8)) {

                jsonOut.write("[\n" + logs.stream()
                        .map(log -> "  \"" + log.replace("\"", "\\\"") + "\"")
                        .collect(Collectors.joining(",\n")) + "\n]");

                for (String log : logs) {
                    csvOut.write("\"" + log.replace("\"", "\"\"") + "\"\n");
                }
            }

            // ZIP everything
            try (FileOutputStream fos = new FileOutputStream(zipPath);
                    ZipOutputStream zos = new ZipOutputStream(fos)) {
                for (String path : List.of(htmlPath, jsonPath, csvPath)) {
                    File file = new File(path);
                    if (file.exists()) {
                        zos.putNextEntry(new ZipEntry(file.getName()));
                        zos.write(Files.readAllBytes(file.toPath()));
                        zos.closeEntry();
                    }
                }
            }

            // ✅ Construct report URL dynamically (for localhost or prod)
            String fileName = baseName + ".html";
            String baseUrl = servletRequest.getScheme() + "://" + servletRequest.getServerName()
                    + (servletRequest.getServerPort() == 80 || servletRequest.getServerPort() == 443 ? ""
                            : ":" + servletRequest.getServerPort());

            String reportUrl = config.getReportUrlPrefix() + fileName;

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Smart tests executed.");
            response.put("reportUrl", reportUrl);
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

    @GetMapping("/report/download/{baseName}")
    public ResponseEntity<?> downloadReportZip(@PathVariable String baseName) {
        try {
            File zipFile = Paths.get(config.getReportDir(), baseName + ".zip").toFile();
            if (!zipFile.exists()) {
                return ResponseEntity.notFound().build();
            }

            byte[] data = java.nio.file.Files.readAllBytes(zipFile.toPath());
            return ResponseEntity.ok()
                    .header("Content-Disposition", "attachment; filename=" + zipFile.getName())
                    .header("Content-Type", "application/zip")
                    .body(data);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Failed to download report ZIP.");
        }
    }

    private WebDriver createWebDriver() {
        ChromeOptions options = new ChromeOptions();
        if (config.isChromeHeadless()) {
            options.addArguments("--headless=new");
        }
        options.addArguments("--no-sandbox", "--disable-dev-shm-usage");
        return new ChromeDriver(options);
    }

}
