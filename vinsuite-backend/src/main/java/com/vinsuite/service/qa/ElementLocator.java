package com.vinsuite.service.qa;

import org.openqa.selenium.*;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class ElementLocator {

    public static WebElement locate(WebDriverWait wait, String type, String value) {
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
                return locateByLabel(wait, value);

            case "aria-label":
                return wait.until(ExpectedConditions.elementToBeClickable(
                        By.xpath("//*[@aria-label='" + value + "']")));

            case "placeholder":
                return wait.until(ExpectedConditions.elementToBeClickable(
                        By.xpath("//*[@placeholder='" + value + "']")));

            case "data-testid":
            case "data-test":
            case "data":
                return wait.until(ExpectedConditions.elementToBeClickable(
                        By.cssSelector("[data-testid='" + value + "'], [data-test='" + value + "'], [data-" + value + "]")));

            default:
                throw new RuntimeException("Unsupported selector type: " + type);
        }
    }

    private static WebElement locateByLabel(WebDriverWait wait, String labelText) {
        try {
            WebElement label = wait.until(ExpectedConditions.presenceOfElementLocated(
                    By.xpath("//label[normalize-space(text())='" + labelText + "']")));
            String forValue = label.getAttribute("for");

            if (forValue != null && !forValue.isBlank()) {
                return wait.until(ExpectedConditions.elementToBeClickable(By.id(forValue)));
            }

            return wait.until(ExpectedConditions.elementToBeClickable(By.xpath(
                    "//label[normalize-space(text())='" + labelText + "']//input | " +
                            "//label[normalize-space(text())='" + labelText + "']//textarea | " +
                            "//label[normalize-space(text())='" + labelText + "']//select")));
        } catch (Exception e) {
            throw new RuntimeException("Unable to locate element by label: \"" + labelText + "\"");
        }
    }
}
