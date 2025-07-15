package com.vinsuite.service.qa;

import com.vinsuite.config.TestAuraConfig;
import com.vinsuite.dto.qa.LogEntry;
import com.vinsuite.model.TestCase;
import org.openqa.selenium.WebDriver;

import java.util.List;
import java.util.Map;

public class TestRunner {

    private final TestAuraConfig config;
    private final ActionStepParser parser;
    private final ActionStepExecutor executor;

    public TestRunner(TestAuraConfig config) {
        this.config = config;
        this.parser = new ActionStepParser();
        this.executor = new ActionStepExecutor();
    }

    public List<LogEntry> runTestCases(List<TestCase> testCases,
                                       Map<String, String> placeholders,
                                       String reportDir,
                                       String baseName,
                                       String timestamp,
                                       String category) throws Exception {

        WebDriver driver = null;
        try {
            driver = WebDriverFactory.create(config);
            return new TestExecutionService(config)
                    .executeAndCapture(driver, parser, executor,
                            testCases, placeholders, reportDir, baseName, timestamp, category);

        } finally {
            if (driver != null) {
                driver.quit();
            }
        }
    }
}
