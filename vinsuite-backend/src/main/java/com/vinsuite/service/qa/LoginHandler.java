package com.vinsuite.service.qa;

import com.vinsuite.model.TestCase;
import org.openqa.selenium.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class LoginHandler {

    public static List<TestCase> injectLoginStepsIfNeeded(WebDriver driver, List<TestCase> testCases,
                                                          Map<String, String> placeholders) {
        if (placeholders == null || testCases == null)
            return testCases;

        String username = placeholders.get("USERNAME");
        String password = placeholders.get("PASSWORD");

        // Skip if no credentials
        if (username == null || password == null || username.isBlank() || password.isBlank()) {
            return testCases;
        }

        // Skip if already injected
        if (alreadyHasLoginSteps(testCases)) {
            return testCases;
        }

        try {
            WebElement usernameInput = driver
                    .findElement(By.xpath("//input[contains(@id,'user') or contains(@name,'user')]"));
            WebElement passwordInput = driver.findElement(By.xpath("//input[@type='password']"));
            WebElement loginButton = driver.findElement(By.xpath(
                    "//input[@type='submit' or contains(@id,'login') or contains(@name,'login') or contains(@class,'login')]"));

            String usernameXPath = getXPath(usernameInput);
            String passwordXPath = getXPath(passwordInput);
            String loginXPath = getXPath(loginButton);

            List<TestCase> loginSteps = new ArrayList<>();
            loginSteps.add(new TestCase("Enter {{USERNAME}} in xpath(\"" + usernameXPath + "\")", "", "", "Enter username", "pre-login"));
            loginSteps.add(new TestCase("Enter {{PASSWORD}} in xpath(\"" + passwordXPath + "\")", "", "", "Enter password", "pre-login"));
            loginSteps.add(new TestCase("Click on xpath(\"" + loginXPath + "\")", "", "", "Click login button", "pre-login"));

            loginSteps.addAll(testCases);
            return loginSteps;

        } catch (Exception e) {
            System.out.println("ℹ️ Login form not detected or some element missing. Skipping login injection.");
            return testCases;
        }
    }

    private static boolean alreadyHasLoginSteps(List<TestCase> testCases) {
        for (TestCase testCase : testCases) {
            String action = testCase.getAction().toLowerCase();
            if (action.contains("{{username}}") || action.contains("{{password}}") || action.contains("login")) {
                return true;
            }
        }
        return false;
    }

    private static String getXPath(WebElement element) {
        return (String) ((JavascriptExecutor) element).executeScript(
                "function absoluteXPath(el) {" +
                        "var comp = [];" +
                        "while (el && el.nodeType === 1) {" +
                        "var sib = 0;" +
                        "var name = el.nodeName.toLowerCase();" +
                        "for (var i = 0; i < el.parentNode.childNodes.length; i++) {" +
                        "var node = el.parentNode.childNodes[i];" +
                        "if (node.nodeType === 1 && node.nodeName.toLowerCase() === name) {" +
                        "if (node === el) break; sib++; } }" +
                        "comp.unshift(name + '[' + (sib+1) + ']'); el = el.parentNode; }" +
                        "return '/' + comp.join('/'); } return absoluteXPath(arguments[0]);",
                element);
    }
}
