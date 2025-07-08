package com.vinsuite.controller.qa;

import com.vinsuite.config.TestAuraConfig;
import com.vinsuite.dto.qa.LogEntry;
import com.vinsuite.dto.qa.RunTestRequest;
import com.vinsuite.model.TestCase;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.TakesScreenshot;
import org.openqa.selenium.TimeoutException;
import com.vinsuite.service.qa.TestExecutionService;
import java.util.function.Function;

import java.util.ArrayList;

import java.util.HashMap;
import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.FileWriter;

import java.io.PrintWriter;
import java.io.StringWriter;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.time.Duration;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import com.vinsuite.service.qa.ActionStep;
import com.vinsuite.service.qa.ActionStepParser;
import com.vinsuite.service.qa.TestCaseGenerationService;
import com.vinsuite.service.qa.TestExecutionService;

import io.github.bonigarcia.wdm.WebDriverManager;
import jakarta.servlet.http.HttpServletRequest;

import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.stream.Collectors;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import java.awt.Desktop;

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
        this.testExecutionService = testExecutionService; // <-- this was missing
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
    public ResponseEntity<?> runSmartTests(@RequestBody RunTestRequest request) {
        cleanupOldReports();

        String url = request.getUrl();
        List<String> functionalities = request.getTests();
        Map<String, String> placeholders = request.getPlaceholders();

        if (url == null || url.isBlank() || functionalities == null || functionalities.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "URL and at least one test name required."));
        }

        try {
            List<TestCase> allCases = new ArrayList<>();

            for (String functionality : functionalities) {
                List<TestCase> categorized = testCaseService.generateCategorizedTests(url, functionality);
                allCases.addAll(categorized);
            }

            Map<String, Object> response = testExecutionService.runTests(
                    url, allCases, String.join(", ", functionalities), placeholders);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "Execution failed", "details", e.getMessage()));
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
        WebDriver driver = new ChromeDriver(options);
        driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(5));
        return driver;
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
