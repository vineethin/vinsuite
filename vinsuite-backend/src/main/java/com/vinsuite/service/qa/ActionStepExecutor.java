package com.vinsuite.service.qa;

import com.vinsuite.dto.qa.LogEntry;
import com.vinsuite.service.qa.ActionStep;
import org.openqa.selenium.*;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Map;

public class ActionStepExecutor {

    public static LogEntry executeStep(WebDriver driver, WebDriverWait wait, JavascriptExecutor js,
            ActionStep step, Map<String, String> placeholders,
            String reportDir, String baseName,
            String timestamp, String expected, String comment) throws Exception {

        // ✅ Inject placeholder values into text
        String text = step.getTextValue();
        if (text != null) {
            for (Map.Entry<String, String> entry : placeholders.entrySet()) {
                text = text.replace("{{" + entry.getKey() + "}}", entry.getValue());
            }
            step.setTextValue(text);
        }

        String selectorVal = step.getSelectorValue();
        if (selectorVal != null) {
            for (Map.Entry<String, String> entry : placeholders.entrySet()) {
                selectorVal = selectorVal.replace("{{" + entry.getKey() + "}}", entry.getValue());
            }
            step.setSelectorValue(selectorVal);
        }

        WebElement el = ElementLocator.locate(wait, step.getSelectorType(), step.getSelectorValue());

        String resolvedText = step.getTextValue() != null ? step.getTextValue() : el.getAttribute("value");
        if (resolvedText == null || resolvedText.isBlank()) {
            resolvedText = "(empty)";
        }

        String resolvedSelector = step.getSelectorValue() != null ? step.getSelectorValue() : "";

        String stepMessage = "[STEP] " + step.getActionType().toUpperCase()
                + " '" + resolvedText + "' in " + step.getSelectorType() + "=" + resolvedSelector;

        switch (step.getActionType()) {
            case "click", "check", "select" -> {
                el.click();
            }

            case "enter", "type" -> {
                String input = step.getTextValue();
                js.executeScript(
                        "arguments[0].value = arguments[1]; arguments[0].dispatchEvent(new Event('input', { bubbles: true })); arguments[0].dispatchEvent(new Event('change', { bubbles: true }));",
                        el, input);
                Thread.sleep(300);
                el.clear();
                el.sendKeys(input);
                Thread.sleep(300);
                js.executeScript("arguments[0].dispatchEvent(new Event('blur', { bubbles: true }));", el);
                wait.until(ExpectedConditions.attributeToBe(el, "value", input));
            }

            case "hover" -> {
                new Actions(driver).moveToElement(el).perform();
            }

            case "scrollto" -> {
                js.executeScript("arguments[0].scrollIntoView({ behavior: 'smooth', block: 'center' });", el);
                Thread.sleep(500);
            }

            case "waitfor" -> {
                wait.until(ExpectedConditions.visibilityOf(el));
            }

            case "asserttext" -> {
                String actual = el.getText().trim();
                String expectedText = step.getTextValue().trim();
                if (!actual.equals(expectedText)) {
                    throw new RuntimeException(
                            "Assertion failed: expected text '" + expectedText + "' but found '" + actual + "'");
                }
            }

            case "asserturl" -> {
                String expectedUrl = step.getTextValue().trim();
                String currentUrl = driver.getCurrentUrl();
                if (!currentUrl.contains(expectedUrl)) {
                    throw new RuntimeException("URL assertion failed: current URL '" + currentUrl
                            + "' does not contain '" + expectedUrl + "'");
                }
            }

            default -> throw new RuntimeException("Unsupported action type: " + step.getActionType());
        }

        // ✅ Screenshot capture
        String stepShot = baseName + "_" + System.nanoTime() + ".png";
        File snap = ((TakesScreenshot) driver).getScreenshotAs(OutputType.FILE);
        Files.copy(snap.toPath(), Paths.get(reportDir, stepShot));

        String category = "positive";

        return new LogEntry(
                timestamp,
                "PASS",
                stepMessage + " executed",
                stepShot,
                expected,
                null,
                category, // testType
                comment,
                category);

    }
}
