package com.vinsuite.service;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class PageFactoryGeneratorService {

    public ResponseEntity<?> generateFromHtml(String html) {
        try {
            Document doc = Jsoup.parse(html);
            Elements elements = doc.select("input, button, select, textarea, a");

            if (elements.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("code", "", "error", "No supported elements found."));
            }

            StringBuilder code = new StringBuilder();
            code.append("import org.openqa.selenium.WebElement;\n");
            code.append("import org.openqa.selenium.support.FindBy;\n");
            code.append("import org.openqa.selenium.support.PageFactory;\n");
            code.append("import org.openqa.selenium.WebDriver;\n\n");
            code.append("public class PageObjectClass {\n\n");

            for (Element el : elements) {
                if (ElementUtils.isIrrelevant(el)) continue;
                String locator = ElementUtils.getBestLocator(el);
                if (locator != null) {
                    code.append("    ").append(locator).append("\n");
                    code.append("    private WebElement ").append(ElementUtils.generateVariableName(el)).append(";\n\n");
                }
            }

            code.append("    public PageObjectClass(WebDriver driver) {\n");
            code.append("        PageFactory.initElements(driver, this);\n");
            code.append("    }\n");
            code.append("}\n");

            return ResponseEntity.ok(Map.of("code", code.toString()));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                    .body(Map.of("code", "", "error", "Failed to generate PageFactory code."));
        }
    }
}
