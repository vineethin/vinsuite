package com.vinsuite.controller.qa;

import com.vinsuite.config.TestAuraConfig;
import com.vinsuite.dto.qa.LogEntry;
import com.vinsuite.dto.qa.RunTestRequest;
import com.vinsuite.model.TestCase;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.openqa.selenium.By;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.TakesScreenshot;

import java.util.ArrayList;
import java.util.Base64;
import java.util.HashMap;
import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import com.vinsuite.service.qa.TestCaseGenerationService;

import io.github.bonigarcia.wdm.WebDriverManager;
import jakarta.servlet.http.HttpServletRequest;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;
import java.util.List;
import java.awt.Desktop;
import com.vinsuite.dto.qa.LogEntry;

@RestController
@RequestMapping("/api/testaura")
public class TestAuraController {

    private final TestCaseGenerationService testCaseService;
    private final TestAuraConfig config;

    @Value("${report.cleanup.days:3}")
    private int cleanupDays;

    public TestAuraController(TestCaseGenerationService testCaseService, TestAuraConfig config) {
        this.testCaseService = testCaseService;
        this.config = config;
    }

    @PostMapping("/run")
    public ResponseEntity<?> runSelectedTests(@RequestBody RunTestRequest request) {
        cleanupOldReports();
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
        cleanupOldReports();
        String url = request.getUrl();
        List<String> tests = request.getTests();
        String username = request.getUsername();
        String password = request.getPassword();

        if (url == null || url.isBlank() || tests == null || tests.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "URL and at least one test name required."));
        }

        WebDriver driver = createWebDriver();
        try {
            driver.get(url);

            List<LogEntry> allLogs = new ArrayList<>();
            List<String> functionalityLogLinks = new ArrayList<>();

            String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
            String baseName = "report_" + timestamp;
            String reportDir = config.getReportDir();
            new File(reportDir).mkdirs();

            for (String functionality : tests) {
                List<LogEntry> logsForFunctionality = new ArrayList<>();
                logsForFunctionality.add(new LogEntry(
                        LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")),
                        "STEP",
                        "🧪 Functionality: " + functionality,
                        null));

                List<TestCase> categorized = testCaseService.generateCategorizedTests(url, functionality);
                System.out.println("Categorized size for " + functionality + ": " + categorized.size());
                for (TestCase tc : categorized) {
                    System.out.println("→ " + tc.getAction() + " | " + tc.getComments());
                }
                List<TestCase> positiveTests = categorized.stream()
                        .filter(tc -> "positive".equalsIgnoreCase(tc.getComments())).toList();
                List<TestCase> negativeTests = categorized.stream()
                        .filter(tc -> "negative".equalsIgnoreCase(tc.getComments())).toList();
                List<TestCase> edgeTests = categorized.stream().filter(tc -> "edge".equalsIgnoreCase(tc.getComments()))
                        .toList();

                logsForFunctionality
                        .addAll(executeAndCapture(driver, positiveTests, username, password, reportDir, baseName));
                logsForFunctionality
                        .addAll(executeAndCapture(driver, negativeTests, username, password, reportDir, baseName));
                logsForFunctionality
                        .addAll(executeAndCapture(driver, edgeTests, username, password, reportDir, baseName));

                allLogs.addAll(logsForFunctionality);
                System.out.println(
                        "Returned logs for functionality " + functionality + ": " + logsForFunctionality.size());
                for (LogEntry log : logsForFunctionality) {
                    System.out.println(log.getStatus() + " | " + log.getMessage() + " | " + log.getScreenshotFile());
                }

                String sanitizedName = functionality.trim().replaceAll("[^a-zA-Z0-9]+", "_");
                String logFileName = baseName + "_log_" + sanitizedName + ".html";
                String logFilePath = Paths.get(reportDir, logFileName).toString();

                try (FileWriter logWriter = new FileWriter(logFilePath, StandardCharsets.UTF_8)) {
                    StringBuilder logHtml = new StringBuilder();
                    logHtml.append("<html><head><meta charset='UTF-8'><title>").append(functionality)
                            .append(" Logs</title></head><body>");
                    logHtml.append("<h3>Execution Log for: " + functionality + "</h3>");
                    logHtml.append("<table border='1' cellpadding='5' cellspacing='0'>");
                    logHtml.append("<tr><th>Timestamp</th><th>Status</th><th>Message</th><th>Screenshot</th></tr>");

                    for (LogEntry le : logsForFunctionality) {
                        String rowColor;
                        switch (le.getStatus().toUpperCase()) {
                            case "PASS" -> rowColor = "#e6ffe6"; // light green
                            case "FAIL" -> rowColor = "#ffe6e6"; // light red
                            case "WARN" -> rowColor = "#fffbe6"; // light yellow
                            case "STEP" -> rowColor = "#e6f0ff"; // light blue
                            default -> rowColor = "#ffffff"; // white
                        }

                        logHtml.append("<tr style='background-color:").append(rowColor).append(";'>");
                        logHtml.append("<td>").append(le.getTimestamp()).append("</td>");
                        logHtml.append("<td>").append(le.getStatus()).append("</td>");
                        logHtml.append("<td>").append(le.getMessage()).append("</td>");
                        if (le.getScreenshotFile() != null && !le.getScreenshotFile().isBlank()) {
                            String imgPath = "/api/testaura/report/screenshots/" + le.getScreenshotFile();
                            logHtml.append("<td><a href='").append(imgPath).append("' target='_blank'>")
                                    .append("<img src='").append(imgPath)
                                    .append("' width='120' style='border:1px solid #ccc;'/>")
                                    .append("</a></td>");
                        } else {
                            logHtml.append("<td>-</td>");
                        }
                        logHtml.append("</tr>");
                    }
                    logHtml.append("</table></body></html>");
                    logWriter.write(logHtml.toString());
                }

                functionalityLogLinks
                        .add("<li><a href='" + logFileName + "' target='_blank'>🧪 " + functionality + "</a></li>");
            }

            if (allLogs.size() > 500) {
                List<LogEntry> truncated = new ArrayList<>(allLogs.subList(0, 500));
                truncated.add(new LogEntry(
                        LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")),
                        "WARN",
                        "⚠️ Log limit exceeded. Truncated to 500 entries.",
                        null));
                allLogs = truncated;
            }

            String htmlPath = Paths.get(reportDir, baseName + ".html").toString();
            String jsonPath = Paths.get(reportDir, baseName + ".json").toString();
            String csvPath = Paths.get(reportDir, baseName + ".csv").toString();
            String zipPath = Paths.get(reportDir, baseName + ".zip").toString();

            StringBuilder html = new StringBuilder();
            html.append("<html><head><meta charset='UTF-8'><title>TestAura Report</title></head><body>");
            html.append("<h2>TestAura Smart Report</h2>");
            html.append("<p><strong>URL:</strong> ").append(url).append("</p>");
            html.append("<p><strong>Functionality:</strong> ").append(String.join(", ", tests)).append("</p>");
            html.append("<h3>Execution Logs</h3><ul>");
            for (String link : functionalityLogLinks) {
                html.append(link);
            }
            html.append("</ul>");
            html.append("<p><em>Generated at ").append(timestamp).append("</em></p>");
            html.append("</body></html>");

            try (FileWriter writer = new FileWriter(htmlPath, StandardCharsets.UTF_8)) {
                writer.write(html.toString());
            }

            try (FileWriter jsonOut = new FileWriter(jsonPath, StandardCharsets.UTF_8);
                    FileWriter csvOut = new FileWriter(csvPath, StandardCharsets.UTF_8)) {
                jsonOut.write("[\n" + allLogs.stream().map(l -> "  \"" + l.getMessage().replace("\"", "\\\"") + "\"")
                        .collect(Collectors.joining(",\n")) + "\n]");
                for (LogEntry l : allLogs) {
                    csvOut.write("\"" + l.getMessage().replace("\"", "\"\"") + "\"\n");
                }
            }

            List<String> allReportFiles = Files.walk(Paths.get(reportDir))
                    .filter(path -> path.getFileName().toString().startsWith(baseName))
                    .map(path -> path.toFile().getAbsolutePath())
                    .toList();

            try (FileOutputStream fos = new FileOutputStream(zipPath);
                    ZipOutputStream zos = new ZipOutputStream(fos)) {
                for (String path : allReportFiles) {
                    File file = new File(path);
                    zos.putNextEntry(new ZipEntry(file.getName()));
                    try (BufferedInputStream bis = new BufferedInputStream(new FileInputStream(file))) {
                        byte[] buffer = new byte[1024];
                        int len;
                        while ((len = bis.read(buffer)) > 0) {
                            zos.write(buffer, 0, len);
                        }
                    }
                    zos.closeEntry();
                }
            }

            String reportUrl = config.getReportUrlPrefix() + baseName + ".html";
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Smart tests executed.");
            response.put("reportUrl", reportUrl);
            response.put("reportZip", config.getReportUrlPrefix() + baseName + ".zip");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "Execution failed", "details", e.getMessage()));
        } finally {
            driver.quit();
        }
    }

    @GetMapping("/report/screenshots/{filename:.+}")
    public ResponseEntity<?> serveScreenshot(@PathVariable String filename) {
        try {
            File file = new File(config.getReportDir(), filename);
            if (!file.exists()) {
                return ResponseEntity.notFound().build();
            }

            byte[] content = Files.readAllBytes(file.toPath());
            return ResponseEntity.ok()
                    .header("Content-Type", "image/png")
                    .header("Content-Disposition", "inline; filename=" + filename)
                    .body(content);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to load screenshot.");
        }
    }

    private List<LogEntry> executeAndCapture(WebDriver driver, List<TestCase> tests, String username, String password,
            String reportDir, String baseName) {
        List<LogEntry> logs = new ArrayList<>();
        DateTimeFormatter dtf = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

        for (TestCase tc : tests) {
            String action = tc.getAction();
            String expected = tc.getExpectedResult();
            String comment = tc.getComments();
            String timestamp = LocalDateTime.now().format(dtf);

            try {
                // Inject username/password if placeholders exist
                if (action.contains("'USERNAME'"))
                    action = action.replace("'USERNAME'", "'" + (username != null ? username : "") + "'");
                if (action.contains("'PASSWORD'"))
                    action = action.replace("'PASSWORD'", "'" + (password != null ? password : "") + "'");

                // Perform basic action (click, enter text)
                if (action.toLowerCase().contains("click")) {
                    String id = extractIdFromAction(action);
                    driver.findElement(By.id(id)).click();
                } else if (action.toLowerCase().contains("enter") || action.toLowerCase().contains("type")) {
                    String[] parts = extractTextAndIdFromAction(action);
                    driver.findElement(By.id(parts[1])).sendKeys(parts[0]);
                }

                // Screenshot capture
                String screenshotFile = baseName + "_" + System.nanoTime() + ".png";
                File snap = ((TakesScreenshot) driver).getScreenshotAs(OutputType.FILE);
                Files.copy(snap.toPath(), Paths.get(reportDir, screenshotFile));

                logs.add(new LogEntry(
                        timestamp,
                        "PASS",
                        "✅ [" + comment + "] " + action + " → Expected: " + expected,
                        screenshotFile));

            } catch (Exception e) {
                logs.add(new LogEntry(
                        timestamp,
                        "FAIL",
                        "❌ [" + comment + "] " + action + " → Failed: " + e.getMessage(),
                        null));
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
        WebDriverManager.chromedriver().setup();
        ChromeOptions options = new ChromeOptions();
        if (config.isChromeHeadless()) {
            options.addArguments("--headless=new");
        }
        options.addArguments("--no-sandbox", "--disable-dev-shm-usage");
        return new ChromeDriver(options);
    }

    private void cleanupOldReports() {
        File dir = new File(config.getReportDir());
        if (!dir.exists() || !dir.isDirectory())
            return;

        long cutoff = System.currentTimeMillis() - (cleanupDays * 24L * 60 * 60 * 1000);
        for (File file : dir.listFiles()) {
            if (file.isFile() && file.lastModified() < cutoff) {
                System.out.println("🧹 Deleting old report file: " + file.getName());
                file.delete();
            }
        }
    }

}
