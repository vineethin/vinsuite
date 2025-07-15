package com.vinsuite.controller.qa;

import com.vinsuite.config.TestAuraConfig;
import com.vinsuite.dto.qa.LogEntry;
import com.vinsuite.dto.qa.RunTestRequest;
import com.vinsuite.model.TestCase;

import org.openqa.selenium.WebDriver;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.TakesScreenshot;
import com.vinsuite.service.qa.TestCaseGenerationService;
import com.vinsuite.service.qa.TestExecutionService;
import com.vinsuite.service.qa.WebDriverFactory;

import java.io.*;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

@RestController
@RequestMapping("/api/testaura")
public class TestAuraController {

    private final TestCaseGenerationService testCaseService;
    private final TestAuraConfig config;
    private final TestExecutionService testExecutionService;

    @Value("${report.cleanup.days:3}")
    private int cleanupDays;

    public TestAuraController(
            TestCaseGenerationService testCaseService,
            TestExecutionService testExecutionService,
            TestAuraConfig config) {
        this.testCaseService = testCaseService;
        this.testExecutionService = testExecutionService;
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

            // Check if the URL is accessible
            if (!isValidUrl(url)) {
                return ResponseEntity.badRequest().body("{\"message\":\"Invalid URL.\"}");
            }

            driver.get(url); // Try opening the URL

            System.out.println("🧪 TestAura is running the following tests on: " + url);
            for (String test : tests) {
                System.out.println("- " + test);
            }

            List<LogEntry> logs = new ArrayList<>();

            // Simulate running tests and create logs (this can be adjusted as per your
            // logic)
            for (String test : tests) {
                System.out.println("Test cases received: " + tests.size());

                System.out.println("Test name: " + test);

                String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
                // Example LogEntry (make sure you replace with actual logic)
                logs.add(new LogEntry(
                        timestamp,
                        "PASS",
                        "Test passed: " + test,
                        "screenshot.png",
                        "Expected",
                        null, // note
                        "positive", // testType
                        "login successful", // comment
                        "positive" // category (can be dynamic)
                ));

            }

            // Screenshot in Base64 format
            String screenshotBase64 = ((TakesScreenshot) driver).getScreenshotAs(OutputType.BASE64);
            driver.quit();

            // Generate report files
            String reportDir = config.getReportDir();
            new File(reportDir).mkdirs();

            String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
            String baseName = "report_" + timestamp;

            String htmlPath = Paths.get(reportDir, baseName + ".html").toString();
            String jsonPath = Paths.get(reportDir, baseName + ".json").toString();
            String csvPath = Paths.get(reportDir, baseName + ".csv").toString();
            String zipPath = Paths.get(reportDir, baseName + ".zip").toString();

            // Generate HTML Report
            generateHtmlReport(htmlPath, url, logs, screenshotBase64, timestamp);

            // Generate JSON + CSV Report
            generateJsonCsvReports(jsonPath, csvPath, tests);

            // Zip the report files
            zipReports(htmlPath, jsonPath, csvPath, zipPath);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Tests executed successfully.");
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

    @PostMapping("/run-smart")
    public ResponseEntity<?> runSmartTests(@RequestBody RunTestRequest request) {
        cleanupOldReports();

        String url = request.getUrl();
        List<String> functionalities = request.getTests();
        Map<String, String> placeholders = Optional.ofNullable(request.getPlaceholders()).orElse(new HashMap<>());

        if (url == null || url.isBlank() || functionalities == null || functionalities.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "URL and at least one test name required."));
        }

        try {
            List<TestCase> allCases = new ArrayList<>();

            // ✅ Step 1: Collect test cases from AI
            for (String functionality : functionalities) {
                List<TestCase> categorized = testCaseService.generateCategorizedTests(url, functionality);
                allCases.addAll(categorized);
            }

            // ✅ Step 2: Sort tests → negative → edge → positive → unknown
            allCases.sort(Comparator.comparing(tc -> {
                String type = Optional.ofNullable(tc.getTestType()).orElse("").toLowerCase();
                switch (type) {
                    case "negative":
                        return 0;
                    case "edge":
                        return 1;
                    case "positive":
                        return 2;
                    default:
                        return 3;
                }
            }));

            // ✅ Step 3: Execute tests
            Map<String, Object> response = testExecutionService.runTests(
                    url,
                    allCases,
                    String.join(", ", functionalities),
                    placeholders,
                    "someCategory");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "Execution failed", "details", e.getMessage()));
        }
    }

    private void generateHtmlReport(String htmlPath, String url, List<LogEntry> logs, String screenshotBase64,
            String timestamp) {
        StringBuilder html = new StringBuilder();
        html.append("<html><head><title>TestAura Report</title>");
        html.append("<style>");
        html.append("table { width: 100%; border-collapse: collapse; }");
        html.append("table, th, td { border: 1px solid black; padding: 8px; text-align: left; }");
        html.append("th { background-color: #f2f2f2; }");
        html.append("tr:nth-child(even) { background-color: #f9f9f9; }");
        html.append("</style></head><body>");
        html.append("<h2>TestAura Execution</h2>");
        html.append("<p><strong>URL:</strong> ").append(url).append("</p>");
        html.append("<p><strong>Generated at:</strong> ").append(timestamp).append("</p>");

        // Table headers
        html.append("<table>");
        html.append("<tr><th>Time</th><th>Status</th><th>Message</th><th>Screenshot</th><th>Test Type</th></tr>");

        for (LogEntry log : logs) {
            html.append("<tr>");
            html.append("<td>").append(log.getTimestamp()).append("</td>");
            html.append("<td>").append(log.getStatus()).append("</td>");
            html.append("<td>").append(log.getMessage()).append("</td>");

            if (log.getScreenshotFile() != null && !log.getScreenshotFile().isEmpty()) {
                html.append("<td><a href='/api/testaura/report/screenshots/")
                        .append(log.getScreenshotFile())
                        .append("' target='_blank'>View</a></td>");
            } else {
                html.append("<td>-</td>");
            }

            html.append("<td>").append(log.getTestType() != null ? log.getTestType() : "-").append("</td>");
            html.append("<td>").append(log.getCategory()).append("</td>");
            html.append("</tr>");
        }

        html.append("</table>");

        // Optional full screenshot section (e.g. from final page)
        if (screenshotBase64 != null && !screenshotBase64.isEmpty()) {
            html.append("<p><strong>Final Screenshot:</strong></p>");
            html.append("<img src='data:image/png;base64,")
                    .append(screenshotBase64)
                    .append("' style='max-width:100%;border:1px solid #ccc;' />");
        }

        html.append("</body></html>");

        try {
            File htmlFile = new File(htmlPath);
            htmlFile.getParentFile().mkdirs();

            try (FileWriter writer = new FileWriter(htmlPath, StandardCharsets.UTF_8)) {
                writer.write(html.toString());
            }

        } catch (IOException e) {
            System.err.println("❌ Error writing HTML report: " + e.getMessage());
            e.printStackTrace();
        }
    }

    private void generateJsonCsvReports(String jsonPath, String csvPath, List<String> tests) {
        try {
            // Ensure the directories exist
            File jsonFile = new File(jsonPath);
            jsonFile.getParentFile().mkdirs(); // Create the directory if it doesn't exist

            File csvFile = new File(csvPath);
            csvFile.getParentFile().mkdirs(); // Create the directory if it doesn't exist

            // JSON report generation
            try (FileWriter jsonOut = new FileWriter(jsonPath, StandardCharsets.UTF_8);
                    FileWriter csvOut = new FileWriter(csvPath, StandardCharsets.UTF_8)) {

                jsonOut.write("[\n" + tests.stream()
                        .map(t -> "  \"" + t.replace("\"", "\\\"") + "\"")
                        .collect(Collectors.joining(",\n")) + "\n]");

                for (String t : tests) {
                    csvOut.write("\"" + t.replace("\"", "\"\"") + "\"\n");
                }
            }

        } catch (IOException e) {
            System.err.println("Error writing JSON or CSV reports: " + e.getMessage());
            e.printStackTrace();
        }
    }

    private void zipReports(String htmlPath, String jsonPath, String csvPath, String zipPath) {
        try (FileOutputStream fos = new FileOutputStream(zipPath);
                ZipOutputStream zos = new ZipOutputStream(fos)) {

            // Loop through each report path and add to zip file
            for (String path : List.of(htmlPath, jsonPath, csvPath)) {
                File file = new File(path);

                // Check if the file exists before adding it to the ZIP
                if (file.exists() && file.isFile()) {
                    zos.putNextEntry(new ZipEntry(file.getName()));

                    // Write file content into the zip entry
                    zos.write(Files.readAllBytes(file.toPath()));
                    zos.closeEntry();
                } else {
                    System.err.println("Warning: File " + file.getName() + " does not exist or is not a valid file.");
                }
            }

            System.out.println("Zip file created successfully at: " + zipPath);

        } catch (IOException e) {
            System.err.println("Error creating zip file: " + e.getMessage());
            e.printStackTrace();
        }
    }

    private WebDriver createWebDriver() {
        return WebDriverFactory.create(config);
    }

    private boolean isValidUrl(String url) {
        try {
            new URL(url).toURI();
            return true;
        } catch (Exception e) {
            return false;
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
                    .body(Files.readString(file.toPath()));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Failed to read report.");
        }
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

    @GetMapping("/report/screenshots/{filename:.+}")
    public ResponseEntity<?> serveScreenshot(@PathVariable String filename) {
        try {
            // Ensure the report directory exists
            File file = new File(config.getReportDir(), filename);
            if (!file.exists()) {
                return ResponseEntity.notFound().build();
            }

            // Read the screenshot file as bytes
            byte[] content = Files.readAllBytes(file.toPath());

            return ResponseEntity.ok()
                    .header("Content-Type", "image/png") // Ensure the content type is PNG
                    .header("Content-Disposition", "inline; filename=" + filename)
                    .body(content);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Failed to load screenshot.");
        }
    }
}
