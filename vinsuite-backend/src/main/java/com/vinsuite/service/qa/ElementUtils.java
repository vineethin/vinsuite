package com.vinsuite.service.qa;

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
        String base = el.id();

        if (base.isEmpty()) base = el.attr("name");
        if (base.isEmpty()) base = el.className().split(" ")[0];
        if (base.isEmpty()) base = el.attr("placeholder");
        if (base.isEmpty()) base = el.text();
        if (base.isEmpty()) base = el.tagName() + "_element";

        return base
                .replaceAll("[^a-zA-Z0-9]", "_")
                .replaceAll("_+", "_")
                .replaceAll("^_+|_+$", "")
                .toLowerCase();
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
            String variableName = generateVariableName(el);
            if (locator != null && !variableName.isEmpty()) {
                code.append("    // Original label: ").append(el.text()).append("\n");
                code.append("    ").append(locator).append("\n");
                code.append("    public WebElement ").append(variableName).append(";\n\n");
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
            String variableName = generateVariableName(el);
            if (locator != null && !variableName.isEmpty()) {
                code.append("    // Original label: ").append(el.text()).append("\n");
                code.append("    ").append(LocatorStrategy.toCSharpFindsBy(locator)).append("\n");
                code.append("    public IWebElement ").append(variableName).append(" { get; set; }\n\n");
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
            String varName = generateVariableName(el);
            String byTuple = locatorToByTuple(locator);
            if (locator != null && !varName.isEmpty()) {
                code.append("        # Original label: ").append(el.text()).append("\n");
                code.append("        self.").append(varName).append(" = WebDriverWait(driver, 10).until(\n");
                code.append("            EC.presence_of_element_located(").append(byTuple).append(")\n");
                code.append("        )\n\n");
            }
        }
    
        return code.toString();
    }

    private static String locatorToByTuple(String locator) {
        return LocatorStrategy.toPythonTuple(locator);
    }
  
    
}

    
