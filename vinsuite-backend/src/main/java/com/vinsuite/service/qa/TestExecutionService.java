package com.vinsuite.service.qa;

import com.vinsuite.config.TestAuraConfig;
import com.vinsuite.dto.qa.LogEntry;
import com.vinsuite.model.TestCase;
import org.openqa.selenium.*;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.springframework.stereotype.Service;

import java.io.*;
import java.nio.file.*;
import java.time.Duration;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class TestExecutionService {

    private final TestAuraConfig config;

    public TestExecutionService(TestAuraConfig config) {
        this.config = config;
    }

    public Map<String, Object> runTests(String url, List<TestCase> testCases,
            String functionality, Map<String, String> placeholders, String category) {

        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
        String baseName = "report_" + timestamp;
        String reportDir = config.getReportDir();
        new File(reportDir).mkdirs();

        List<LogEntry> allLogs = new ArrayList<>();
        ActionStepExecutor executor = new ActionStepExecutor();
        ActionStepParser parser = new ActionStepParser();

        for (int i = 0; i < testCases.size(); i++) {
            TestCase testCase = testCases.get(i);
            System.out.println("▶️ Running test case " + (i + 1) + ": " + testCase.getComments());
            WebDriver driver = null;

            try {
                driver = WebDriverFactory.create(config);
                driver.get(url);

                // 🔐 Inject login steps if required for this test case
                List<TestCase> enriched = LoginHandler.injectLoginStepsIfNeeded(driver,
                        Collections.singletonList(testCase), placeholders);

                String now = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));

                List<LogEntry> logs = executeAndCapture(
                        driver,
                        parser,
                        executor,
                        enriched,
                        placeholders,
                        reportDir,
                        baseName + "_tc" + (i + 1),
                        now,
                        category);
                allLogs.addAll(logs);
            } catch (Exception e) {
                e.printStackTrace();
            } finally {
                if (driver != null) {
                    driver.quit();
                }
            }
        }

        return ReportWriter.write(allLogs, baseName, reportDir, url, functionality, config);
    }

    public void enterText(WebDriver driver, WebElement element, String value) {
        try {
            element.clear();
            element.sendKeys(value);

            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(5));
            wait.until(d -> value.equals(element.getAttribute("value")));
        } catch (Exception e1) {
            try {
                JavascriptExecutor js = (JavascriptExecutor) driver;
                js.executeScript("arguments[0].value = arguments[1];", element, value);

                WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(5));
                wait.until(d -> value.equals(element.getAttribute("value")));
            } catch (Exception e2) {
                System.out.println("⚠️ Failed to enter text using both methods: " + e2.getMessage());
            }
        }
    }

    public List<LogEntry> executeAndCapture(WebDriver driver,
            ActionStepParser parser,
            ActionStepExecutor executor,
            List<TestCase> testCases,
            Map<String, String> placeholders,
            String reportDir,
            String baseName,
            String timestamp,
            String category) throws Exception {

        List<LogEntry> allLogs = new ArrayList<>();
        JavascriptExecutor js = (JavascriptExecutor) driver;
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));

        for (TestCase testCase : testCases) {
            String expected = testCase.getExpectedResult();
            String comment = testCase.getComments();
            String resolvedAction = PlaceholderUtils.resolve(testCase.getAction(), placeholders);
            System.out.println("✅ Resolved Action: " + resolvedAction);
            List<ActionStep> steps = parser.parseActionSteps(resolvedAction, category, placeholders);

            if (steps == null || steps.isEmpty()) {
                System.out.println("[WARN] Parser failed for: " + resolvedAction);
                continue;
            }
            System.out.println("🔍 Parsed Steps for test case: " + testCase.getComments());
            for (ActionStep step : steps) {
                try {
                    LogEntry log = executor.executeStep(
                            driver, wait, js, step, placeholders, reportDir, baseName,
                            timestamp, expected, comment, testCase.getTestType());
                    allLogs.add(log);
                } catch (Exception e) {
                    String failShot = baseName + "_fail_" + System.nanoTime() + ".png";
                    try {
                        File snap = ((TakesScreenshot) driver).getScreenshotAs(OutputType.FILE);
                        Files.copy(snap.toPath(), Paths.get(reportDir, failShot));
                    } catch (IOException ignored) {
                    }

                    allLogs.add(new LogEntry(
                            timestamp,
                            "FAIL",
                            "[" + comment + "] " + step.getActionType() + " → " + e.getMessage(),
                            failShot,
                            expected,
                            null, // note
                            category, // use category as testType
                            comment,
                            category));
                }
            }
        }

        return allLogs;
    }

}
