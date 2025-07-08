package com.vinsuite.service.qa;

import com.vinsuite.config.TestAuraConfig;
import com.vinsuite.dto.qa.LogEntry;
import com.vinsuite.model.TestCase;
import org.openqa.selenium.*;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import io.github.bonigarcia.wdm.WebDriverManager;
import org.springframework.stereotype.Service;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.nio.file.*;
import java.time.Duration;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

@Service
public class TestExecutionService {

    private final TestAuraConfig config;

    public TestExecutionService(TestAuraConfig config) {
        this.config = config;
    }

    public Map<String, Object> runTests(String url, List<TestCase> testCases,
            String functionality, Map<String, String> placeholders) {

        WebDriver driver = createWebDriver();
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
        String baseName = "report_" + timestamp;
        String reportDir = config.getReportDir();
        new File(reportDir).mkdirs();

        List<LogEntry> logs = new ArrayList<>();

        try {
            driver.get(url);
            logs = executeAndCapture(driver, testCases, placeholders, reportDir, baseName, functionality);
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            driver.quit();
        }

        return writeReportsAndReturnResponse(logs, baseName, reportDir, url, functionality);
    }

    private WebDriver createWebDriver() {
        WebDriverManager.chromedriver().setup();
        ChromeOptions options = new ChromeOptions();

        if (config.isChromeHeadless()) {
            options.addArguments("--headless=new");
            options.addArguments("--window-size=1920,1080"); // ✅ Set large window size in headless
        }

        options.addArguments("--no-sandbox", "--disable-dev-shm-usage");

        WebDriver driver = new ChromeDriver(options);
        driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(5));

        if (!config.isChromeHeadless()) {
            driver.manage().window().maximize(); // ✅ Maximize only in visible mode
        }

        return driver;
    }

    private List<LogEntry> executeAndCapture(WebDriver driver, List<TestCase> testCases,
            Map<String, String> placeholders, String reportDir, String baseName, String functionality) {

        List<LogEntry> logs = new ArrayList<>();
        DateTimeFormatter dtf = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        JavascriptExecutor js = (JavascriptExecutor) driver;
        ActionStepParser parser = new ActionStepParser();

        for (TestCase test : testCases) {
            String originalAction = test.getAction();
            String expected = test.getExpectedResult();
            String comment = test.getComments();
            String timestamp = LocalDateTime.now().format(dtf);

            String action = originalAction;

            try {
                // ✅ Replace placeholders in full action string (before parsing)
                if (placeholders != null && !placeholders.isEmpty()) {
                    for (Map.Entry<String, String> entry : placeholders.entrySet()) {
                        action = action.replace("{{" + entry.getKey() + "}}", entry.getValue());
                    }
                }

                action = action.replace("\"", "'"); // Normalize quotes for XPath compatibility
                List<ActionStep> steps = parser.parseActionSteps(action);
                if (steps == null || steps.isEmpty()) {
                    System.out.println("[WARN] Parser failed for: " + action);
                    continue;
                }

                for (ActionStep step : steps) {
                    // ✅ Replace placeholders inside textValue again just in case
                    String val = step.getTextValue();
                    if (val != null && placeholders != null) {
                        for (Map.Entry<String, String> entry : placeholders.entrySet()) {
                            val = val.replace("{{" + entry.getKey() + "}}", entry.getValue());
                        }
                        step.setTextValue(val);
                    }

                    WebElement el = locateElement(wait, step.getSelectorType(), step.getSelectorValue());
                    String stepMessage = "[STEP] " + step.toString();

                    switch (step.getActionType()) {
                        case "click", "check", "select" -> {
                            el.click();
                            if (step.getSelectorValue().toLowerCase().contains("login")) {
                                try {
                                    wait.until(d -> !d.getCurrentUrl().contains("login"));
                                } catch (Exception ignored) {
                                }
                            }
                        }

                        case "enter", "type" -> {
                            String input = step.getTextValue();
                            if (input == null || input.isBlank()) {
                                throw new RuntimeException("No text to enter.");
                            }

                            el.clear();
                            Thread.sleep(300);
                            el.sendKeys(input);
                            Thread.sleep(300);

                            // If input not visible in screenshots, inject manually
                            String entered = el.getAttribute("value");
                            if (entered == null || !entered.equals(input)) {
                                js.executeScript(
                                        "arguments[0].value = arguments[1];" +
                                                "arguments[0].dispatchEvent(new Event('input', { bubbles: true }));" +
                                                "arguments[0].dispatchEvent(new Event('change', { bubbles: true }));" +
                                                "arguments[0].dispatchEvent(new Event('blur', { bubbles: true }));",
                                        el, input);
                            }

                            wait.until(ExpectedConditions.attributeToBe(el, "value", input));
                        }

                        default -> throw new RuntimeException("Unsupported action type: " + step.getActionType());
                    }

                    // ✅ Screenshot after every successful step
                    String stepShot = baseName + "_" + System.nanoTime() + ".png";
                    File snap = ((TakesScreenshot) driver).getScreenshotAs(OutputType.FILE);
                    Files.copy(snap.toPath(), Paths.get(reportDir, stepShot));

                    logs.add(new LogEntry(timestamp, "PASS", stepMessage + " executed", stepShot));
                }

            } catch (Exception e) {
                String errorMsg = e.getMessage();
                if (errorMsg != null && errorMsg.contains("Build info:")) {
                    errorMsg = errorMsg.split("Build info:")[0].trim();
                }

                String failShot = baseName + "_fail_" + System.nanoTime() + ".png";
                try {
                    File snap = ((TakesScreenshot) driver).getScreenshotAs(OutputType.FILE);
                    Files.copy(snap.toPath(), Paths.get(reportDir, failShot));
                } catch (IOException ignored) {
                }

                logs.add(new LogEntry(timestamp, "FAIL",
                        "[" + comment + "] " + action + " → " + errorMsg, failShot));
            }
        }

        return logs;
    }

    private WebElement locateElement(WebDriverWait wait, String type, String value) {
        switch (type.toLowerCase()) {
            case "id":
                return wait.until(ExpectedConditions.elementToBeClickable(By.id(value)));

            case "name":
                return wait.until(ExpectedConditions.elementToBeClickable(By.name(value)));

            case "xpath":
                return wait.until(ExpectedConditions.elementToBeClickable(By.xpath(value)));

            case "css":
                return wait.until(ExpectedConditions.elementToBeClickable(By.cssSelector(value)));

            case "label":
                // 🧠 Locate by <label> either via 'for' or nested input/select/textarea
                try {
                    WebElement label = wait.until(ExpectedConditions.presenceOfElementLocated(
                            By.xpath("//label[normalize-space(text())='" + value + "']")));
                    String forValue = label.getAttribute("for");

                    if (forValue != null && !forValue.isBlank()) {
                        return wait.until(ExpectedConditions.elementToBeClickable(By.id(forValue)));
                    }

                    return wait.until(ExpectedConditions.elementToBeClickable(By.xpath(
                            "//label[normalize-space(text())='" + value + "']//input | " +
                                    "//label[normalize-space(text())='" + value + "']//textarea | " +
                                    "//label[normalize-space(text())='" + value + "']//select")));
                } catch (Exception e) {
                    throw new RuntimeException("Unable to locate element by label: \"" + value + "\"");
                }

            case "aria-label":
                try {
                    return wait.until(ExpectedConditions.elementToBeClickable(
                            By.xpath("//*[@aria-label='" + value + "']")));
                } catch (Exception e) {
                    throw new RuntimeException("Unable to locate element by aria-label: \"" + value + "\"");
                }

            case "placeholder":
                try {
                    return wait.until(ExpectedConditions.elementToBeClickable(
                            By.xpath("//*[@placeholder='" + value + "']")));
                } catch (Exception e) {
                    throw new RuntimeException("Unable to locate element by placeholder: \"" + value + "\"");
                }

            case "data-testid":
            case "data-test":
            case "data":
                try {
                    return wait.until(ExpectedConditions.elementToBeClickable(
                            By.cssSelector("[data-testid='" + value + "'], [data-test='" + value + "'], [data-" + value
                                    + "]")));
                } catch (Exception e) {
                    throw new RuntimeException("Unable to locate element by data-* attribute: \"" + value + "\"");
                }

            default:
                throw new RuntimeException("Unsupported selector type: " + type);
        }
    }

    private Map<String, Object> writeReportsAndReturnResponse(List<LogEntry> logs, String baseName, String reportDir,
            String url, String functionality) {
        System.out.println("[DEBUG] Logs captured: " + logs.size());
        for (LogEntry log : logs) {
            System.out.println(log);
        }
        String htmlPath = Paths.get(reportDir, baseName + ".html").toString();
        String jsonPath = Paths.get(reportDir, baseName + ".json").toString();
        String csvPath = Paths.get(reportDir, baseName + ".csv").toString();
        String zipPath = Paths.get(reportDir, baseName + ".zip").toString();

        try (FileWriter html = new FileWriter(htmlPath, StandardCharsets.UTF_8);
                FileWriter json = new FileWriter(jsonPath, StandardCharsets.UTF_8);
                FileWriter csv = new FileWriter(csvPath, StandardCharsets.UTF_8)) {

            // HTML report
            html.write("<html><head><meta charset='UTF-8'><title>TestAura Report</title></head><body>");
            html.write("<h2>TestAura Execution</h2>");
            html.write("<p><strong>URL:</strong> " + url + "</p>");
            html.write("<p><strong>Functionality:</strong> " + functionality + "</p>");
            html.write("<table border='1'><thead><tr>");
            html.write("<th>Time</th><th>Status</th><th>Message</th><th>Screenshot</th>");
            html.write("</tr></thead><tbody>");

            for (LogEntry log : logs) {
                html.write("<tr>");
                html.write("<td>" + log.getTimestamp() + "</td>");
                html.write("<td>" + log.getStatus() + "</td>");
                html.write("<td>" + log.getMessage() + "</td>");
                if (log.getScreenshotFile() != null && !log.getScreenshotFile().isEmpty()) {
                    html.write("<td><a href='/api/testaura/report/screenshots/" + log.getScreenshotFile()
                            + "' target='_blank'>View</a></td>");
                } else {
                    html.write("<td>-</td>");
                }
                html.write("</tr>");
            }

            html.write("</tbody></table></body></html>");

            // JSON export (only messages)
            json.write("[\n" + logs.stream()
                    .map(log -> "  \"" + log.getMessage().replace("\"", "\\\"") + "\"")
                    .collect(Collectors.joining(",\n")) + "\n]");

            // CSV export (message only)
            for (LogEntry log : logs) {
                csv.write("\"" + log.getMessage().replace("\"", "\"\"") + "\"\n");
            }

            // ZIP report files
            try (ZipOutputStream zipOut = new ZipOutputStream(new FileOutputStream(zipPath))) {
                for (String path : List.of(htmlPath, jsonPath, csvPath)) {
                    File file = new File(path);
                    if (file.exists()) {
                        zipOut.putNextEntry(new ZipEntry(file.getName()));
                        zipOut.write(Files.readAllBytes(file.toPath()));
                        zipOut.closeEntry();
                    }
                }
            }

        } catch (IOException e) {
            e.printStackTrace();
        }

        // Final response
        Map<String, Object> response = new HashMap<>();
        response.put("reportUrl", config.getReportUrlPrefix() + baseName + ".html");
        response.put("reportZip", config.getReportUrlPrefix() + baseName + ".zip");
        response.put("message", "✅ Tests completed with " + logs.size() + " steps.");
        return response;
    }

}
