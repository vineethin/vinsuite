package com.vinsuite.controller.qa;

import com.vinsuite.service.qa.QAGroqAIService;
import jakarta.servlet.http.HttpServletResponse;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/page-test")
public class PageTestController {

    @Autowired
    private QAGroqAIService groqAIService;

    @PostMapping
    public ResponseEntity<Map<String, Object>> testPage(@RequestBody Map<String, String> request) {
        String url = request.get("url");
        Map<String, Object> report = new HashMap<>();

        try {
            Document doc = Jsoup.connect(url).get();
            String title = doc.title();

            List<String> issues = new ArrayList<>();
            int passed = 0, failed = 0;

            // --- Semantic HTML Checks ---
            if (doc.select("header, main, section, article, footer").isEmpty()) {
                issues.add("❌ Missing semantic structure: header/main/section/article/footer");
                failed++;
            } else {
                passed++;
            }

            if (doc.select("h1").isEmpty()) {
                issues.add("❌ Missing <h1> tag");
                failed++;
            } else {
                passed++;
            }

            // --- Accessibility Checks ---
            Elements imgs = doc.select("img");
            for (Element img : imgs) {
                if (!img.hasAttr("alt") || img.attr("alt").isBlank()) {
                    issues.add("❌ <img> missing alt attribute");
                    failed++;
                    break;
                }
            }
            if (!imgs.isEmpty()) passed++;

            Elements inputs = doc.select("input");
            boolean unlabeledInputFound = false;
            for (Element input : inputs) {
                String id = input.id();
                boolean hasLabel = !id.isEmpty() && doc.select("label[for=" + id + "]").size() > 0;
                if (!hasLabel) {
                    unlabeledInputFound = true;
                    issues.add("❌ Input field without label");
                    failed++;
                    break;
                }
            }
            if (!inputs.isEmpty() && !unlabeledInputFound) passed++;

            // --- SEO Checks ---
            if (title == null || title.isBlank()) {
                issues.add("❌ Missing or empty <title> tag");
                failed++;
            } else {
                passed++;
            }

            if (doc.select("meta[name=description]").isEmpty()) {
                issues.add("❌ Missing <meta name='description'>");
                failed++;
            } else {
                passed++;
            }

            Elements h1s = doc.select("h1");
            if (h1s.size() > 1) {
                issues.add("⚠️ More than one <h1> tag found");
            }

            Elements links = doc.select("a");
            for (Element link : links) {
                if (!link.hasAttr("href") || link.attr("href").isBlank()) {
                    issues.add("❌ <a> tag missing href attribute");
                    failed++;
                    break;
                }
            }
            if (!links.isEmpty()) passed++;

            // --- AI-Based Structure Scoring ---
            String html = doc.outerHtml();
            Map<String, Object> aiResult = groqAIService.analyzePageStructureWithAI(html, url);

            int score = (int) aiResult.getOrDefault("aiScore", 50);
            String comment = aiResult.getOrDefault("aiComment", "⚠️ AI scoring not available.").toString();

            // --- Final Report ---
            report.put("url", url);
            report.put("status", "Test completed");
            report.put("pageTitle", title);
            report.put("summary", Map.of("totalTests", passed + failed, "passed", passed, "failed", failed));
            report.put("issues", issues);
            report.put("aiScore", score);
            report.put("aiComment", comment);

            return ResponseEntity.ok(report);

        } catch (Exception e) {
            report.put("url", url);
            report.put("status", "❌ Failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(report);
        }
    }

    @PostMapping("/export/excel")
public void exportExcel(@RequestBody Map<String, String> request, HttpServletResponse response) {
    String url = request.get("url");

    try (Workbook workbook = new XSSFWorkbook()) {
        Sheet sheet = workbook.createSheet("Test Report");

        Document doc = Jsoup.connect(url).get();
        String title = doc.title();
        List<String> issues = new ArrayList<>();
        int passed = 0, failed = 0;

        // Semantic checks
        if (doc.select("header, main, section, article, footer").isEmpty()) {
            issues.add("❌ Missing semantic structure: header/main/section/article/footer");
            failed++;
        } else passed++;

        if (doc.select("h1").isEmpty()) {
            issues.add("❌ Missing <h1> tag");
            failed++;
        } else passed++;

        // Accessibility checks
        Elements imgs = doc.select("img");
        for (Element img : imgs) {
            if (!img.hasAttr("alt") || img.attr("alt").isBlank()) {
                issues.add("❌ <img> missing alt attribute");
                failed++;
                break;
            }
        }
        if (!imgs.isEmpty()) passed++;

        Elements inputs = doc.select("input");
        for (Element input : inputs) {
            String id = input.id();
            boolean hasLabel = !id.isEmpty() && doc.select("label[for=" + id + "]").size() > 0;
            if (!hasLabel) {
                issues.add("❌ Input field without label");
                failed++;
                break;
            }
        }
        if (!inputs.isEmpty()) passed++;

        // SEO checks
        if (title == null || title.isBlank()) {
            issues.add("❌ Missing or empty <title> tag");
            failed++;
        } else passed++;

        if (doc.select("meta[name=description]").isEmpty()) {
            issues.add("❌ Missing <meta name='description'>");
            failed++;
        } else passed++;

        Elements links = doc.select("a");
        for (Element link : links) {
            if (!link.hasAttr("href") || link.attr("href").isBlank()) {
                issues.add("❌ <a> tag missing href attribute");
                failed++;
                break;
            }
        }
        if (!links.isEmpty()) passed++;

        // AI score
        String html = doc.outerHtml();
        Map<String, Object> aiResult = groqAIService.analyzePageStructureWithAI(html, url);
        int aiScore = (int) aiResult.getOrDefault("aiScore", 50);
        String aiComment = aiResult.getOrDefault("aiComment", "⚠️ AI scoring not available.").toString();

        // Excel Output
        Row titleRow = sheet.createRow(0);
        titleRow.createCell(0).setCellValue("Page Test Report");

        Row pageRow = sheet.createRow(2);
        pageRow.createCell(0).setCellValue("Page Title:");
        pageRow.createCell(1).setCellValue(title);

        sheet.createRow(3).createCell(0).setCellValue("URL:");
        sheet.getRow(3).createCell(1).setCellValue(url);

        sheet.createRow(5).createCell(0).setCellValue("AI Score:");
        sheet.getRow(5).createCell(1).setCellValue(aiScore);

        sheet.createRow(6).createCell(0).setCellValue("AI Comment:");
        sheet.getRow(6).createCell(1).setCellValue(aiComment);

        // Summary
        Row summaryHeader = sheet.createRow(8);
        summaryHeader.createCell(0).setCellValue("Summary");

        Row summaryRow = sheet.createRow(9);
        summaryRow.createCell(0).setCellValue("Total Tests");
        summaryRow.createCell(1).setCellValue(passed + failed);
        summaryRow.createCell(2).setCellValue("Passed");
        summaryRow.createCell(3).setCellValue(passed);
        summaryRow.createCell(4).setCellValue("Failed");
        summaryRow.createCell(5).setCellValue(failed);

        // Issues
        sheet.createRow(11).createCell(0).setCellValue("Issues Found:");
        int rowNum = 12;
        for (String issue : issues) {
            sheet.createRow(rowNum++).createCell(0).setCellValue(issue);
        }

        response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        response.setHeader("Content-Disposition", "attachment; filename=page-test-report.xlsx");
        workbook.write(response.getOutputStream());

    } catch (Exception e) {
        throw new RuntimeException("❌ Failed to export Excel: " + e.getMessage());
    }
}

}
