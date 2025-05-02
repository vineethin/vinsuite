// ✅ Updated PageObjectGenerationService.java
package com.vinsuite.service.qa;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.select.Elements;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class PageObjectGenerationService {

    public ResponseEntity<?> generate(String html, String language) {
        try {
            Document doc = Jsoup.parse(html);
            Elements elements = doc.select("input, button, select, textarea, a");

            if (elements.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("code", "", "error", "No supported elements found."));
            }

            String code;
            switch (language.toLowerCase()) {
                case "java" -> code = ElementUtils.generateJava(elements);
                case "csharp" -> code = ElementUtils.generateCSharp(elements);
                case "python" -> code = ElementUtils.generatePython(elements);
                default -> {
                    return ResponseEntity.badRequest().body(Map.of("code", "", "error", "Unsupported language: " + language));
                }
            }

            return ResponseEntity.ok(Map.of("code", code));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(Map.of("code", "", "error", "Page object generation failed."));
        }
    }
}