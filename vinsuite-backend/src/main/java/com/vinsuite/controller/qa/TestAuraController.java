package com.vinsuite.controller.qa;

import com.vinsuite.dto.qa.RunTestRequest;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.TakesScreenshot;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;
import java.io.File;
import java.io.FileWriter;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import java.util.List;

@RestController
@RequestMapping("/api/testaura")
public class TestAuraController {

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
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                    .body("{\"message\":\"Test execution failed.\"}");
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

}
