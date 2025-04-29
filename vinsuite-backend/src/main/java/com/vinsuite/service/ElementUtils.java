package com.vinsuite.service;

import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

public class ElementUtils {

    public static boolean isIrrelevant(Element el) {
        String tag = el.tagName();
        String type = el.attr("type");
        return tag.equalsIgnoreCase("input") && (
                type.equalsIgnoreCase("hidden") ||
                type.equalsIgnoreCase("submit") ||
                type.equalsIgnoreCase("image")
        );
    }

    public static String getBestLocator(Element el) {
        String id = el.id();
        String name = el.attr("name");
        String cssClass = el.className();
        String placeholder = el.attr("placeholder");
        String text = el.text();

        if (!id.isEmpty()) return String.format("@FindBy(id = \"%s\")", id);
        if (!name.isEmpty()) return String.format("@FindBy(name = \"%s\")", name);
        if (!cssClass.isEmpty()) return String.format("@FindBy(css = \".%s\")", cssClass.replace(" ", "."));
        if (!placeholder.isEmpty()) return String.format("@FindBy(xpath = \"//*[contains(@placeholder,'%s')]\")", placeholder);
        if (!text.isEmpty()) return String.format("@FindBy(xpath = \"//*[text()='%s']\")", text);
        return null;
    }

    public static String generateVariableName(Element el) {
        if (!el.id().isEmpty()) return el.id();
        if (!el.attr("name").isEmpty()) return el.attr("name");
        if (!el.className().isEmpty()) return el.className().split(" ")[0];
        if (!el.attr("placeholder").isEmpty()) return el.attr("placeholder").replaceAll("\\s+", "_").toLowerCase();
        if (!el.text().isEmpty()) return el.text().replaceAll("\\s+", "_").toLowerCase();
        return el.tagName() + "_element";
    }

    public static String generateJava(Elements elements) {
        StringBuilder code = new StringBuilder();
        code.append("import org.openqa.selenium.WebElement;\n");
        code.append("import org.openqa.selenium.support.FindBy;\n");
        code.append("import org.openqa.selenium.support.PageFactory;\n");
        code.append("import org.openqa.selenium.WebDriver;\n\n");
        code.append("public class PageObjectClass {\n\n");

        for (Element el : elements) {
            if (isIrrelevant(el)) continue;
            String locator = getBestLocator(el);
            if (locator != null) {
                code.append("    ").append(locator).append("\n");
                code.append("    public WebElement ").append(generateVariableName(el)).append(";\n\n");
            }
        }

        code.append("    public PageObjectClass(WebDriver driver) {\n");
        code.append("        PageFactory.initElements(driver, this);\n");
        code.append("    }\n");
        code.append("}\n");

        return code.toString();
    }

    public static String generateCSharp(Elements elements) {
        StringBuilder code = new StringBuilder();
        code.append("using OpenQA.Selenium;\n");
        code.append("using SeleniumExtras.PageObjects;\n\n");
        code.append("public class PageObjectClass {\n");
        code.append("    public PageObjectClass(IWebDriver driver) {\n");
        code.append("        PageFactory.InitElements(driver, this);\n");
        code.append("    }\n\n");

        for (Element el : elements) {
            if (isIrrelevant(el)) continue;
            String locator = getBestLocator(el);
            if (locator != null) {
                code.append("    [").append(locator.replace("@FindBy", "FindsBy")).append("]\n");
                code.append("    public IWebElement ").append(generateVariableName(el)).append(" { get; set; }\n\n");
            }
        }

        code.append("}\n");
        return code.toString();
    }

    public static String generatePython(Elements elements) {
        StringBuilder code = new StringBuilder();
        code.append("from selenium.webdriver.common.by import By\n");
        code.append("from selenium.webdriver.support.ui import WebDriverWait\n");
        code.append("from selenium.webdriver.support import expected_conditions as EC\n\n");
        code.append("class PageObjectClass:\n");
        code.append("    def __init__(self, driver):\n");
        code.append("        self.driver = driver\n\n");

        for (Element el : elements) {
            if (isIrrelevant(el)) continue;
            String locator = getBestLocator(el);
            if (locator != null) {
                String varName = generateVariableName(el);
                String byTuple = locatorToByTuple(locator);
                code.append("        self.").append(varName).append(" = WebDriverWait(driver, 10).until(\n");
                code.append("            EC.presence_of_element_located(").append(byTuple).append(")\n");
                code.append("        )\n\n");
            }
        }

        return code.toString();
    }

    private static String locatorToByTuple(String locator) {
        if (locator.contains("id =")) {
            String val = locator.split("\"")[1];
            return "(By.ID, \"" + val + "\")";
        } else if (locator.contains("name =")) {
            String val = locator.split("\"")[1];
            return "(By.NAME, \"" + val + "\")";
        } else if (locator.contains("css =")) {
            String val = locator.split("\"")[1];
            return "(By.CSS_SELECTOR, \"" + val + "\")";
        } else if (locator.contains("xpath =")) {
            String val = locator.split("\"")[1];
            return "(By.XPATH, \"" + val + "\")";
        }
        return "\"\", \"\"";
    }
}
