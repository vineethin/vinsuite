package com.vinsuite.service.qa;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import java.util.HashMap;
import java.util.Map;

@Service
public class TestExecutionService {

    @Value("${testaura.report.dir}")
    private String reportDir;

    @Value("${testaura.report.url.prefix}")
    private String reportUrlPrefix;

    public Map<String, Object> runTests(String url, String functionality) {
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
        String baseName = "report_" + timestamp;
        new File(reportDir).mkdirs();

        String htmlPath = reportDir + "/" + baseName + ".html";
        String htmlContent = "<html><head><title>TestAura Report</title></head><body>"
                           + "<h2>TestAura Smart Report</h2>"
                           + "<p><strong>URL:</strong> " + url + "</p>"
                           + "<p><strong>Functionality:</strong> " + functionality + "</p>"
                           + "<p><em>Generated at " + timestamp + "</em></p>"
                           + "</body></html>";

        try {
            Files.writeString(Paths.get(htmlPath), htmlContent, StandardCharsets.UTF_8);
        } catch (Exception e) {
            e.printStackTrace();
        }

        Map<String, Object> response = new HashMap<>();
        response.put("reportUrl", reportUrlPrefix + "/" + baseName + ".html");
        return response;
    }
}
