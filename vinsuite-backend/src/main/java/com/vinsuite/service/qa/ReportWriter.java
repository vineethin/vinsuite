package com.vinsuite.service.qa;

import com.vinsuite.config.TestAuraConfig;
import com.vinsuite.dto.qa.LogEntry;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.*;
import java.util.stream.Collectors;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

public class ReportWriter {

    public static Map<String, Object> write(List<LogEntry> logs, String baseName, String reportDir,
            String url, String functionality, TestAuraConfig config) {
        String htmlPath = Paths.get(reportDir, baseName + ".html").toString();
        String jsonPath = Paths.get(reportDir, baseName + ".json").toString();
        String csvPath = Paths.get(reportDir, baseName + ".csv").toString();
        String zipPath = Paths.get(reportDir, baseName + ".zip").toString();

        try (FileWriter html = new FileWriter(htmlPath, StandardCharsets.UTF_8);
                FileWriter json = new FileWriter(jsonPath, StandardCharsets.UTF_8);
                FileWriter csv = new FileWriter(csvPath, StandardCharsets.UTF_8)) {

            // HTML report
            html.write("<html><head><meta charset='UTF-8'><title>TestAura Report</title></head><body>");
            html.write("<h2>TestAura Execution</h2>");
            html.write("<p><strong>URL:</strong> " + url + "</p>");
            html.write("<p><strong>Functionality:</strong> " + functionality + "</p>");
            html.write("<table border='1'><thead><tr>");
            html.write("<th>Time</th><th>Status</th><th>Message</th><th>Screenshot</th><th>Test Type</th>");
            html.write("</tr></thead><tbody>");

            for (LogEntry log : logs) {
                html.write("<tr>");
                html.write("<td>" + log.getTimestamp() + "</td>");
                html.write("<td>" + log.getStatus() + "</td>");
                html.write("<td>" + log.getMessage() + "</td>");

                if (log.getScreenshotFile() != null && !log.getScreenshotFile().isEmpty()) {
                    html.write("<td><a href='/api/testaura/report/screenshots/" + log.getScreenshotFile()
                            + "' target='_blank'>View</a></td>");
                } else {
                    html.write("<td>-</td>");
                }

                // ✅ ADD THIS LINE — it was missing!
                html.write("<td>" + (log.getTestType() != null ? log.getTestType() : "-") + "</td>");

                html.write("</tr>");
            }

            html.write("</tbody></table></body></html>");

            // JSON report (message-only)
            json.write("[\n");
            for (int i = 0; i < logs.size(); i++) {
                LogEntry log = logs.get(i);
                json.write("  {\n");
                json.write("    \"timestamp\": \"" + log.getTimestamp() + "\",\n");
                json.write("    \"status\": \"" + log.getStatus() + "\",\n");
                json.write("    \"message\": \"" + log.getMessage().replace("\"", "\\\"") + "\",\n");
                json.write("    \"screenshotFile\": \"" + log.getScreenshotFile() + "\",\n");
                json.write("    \"expected\": \""
                        + (log.getExpectedResult() != null ? log.getExpectedResult().replace("\"", "\\\"") : "")
                        + "\",\n");
                json.write("    \"comment\": \""
                        + (log.getComment() != null ? log.getComment().replace("\"", "\\\"") : "") + "\",\n");
                json.write("    \"testType\": \"" + log.getTestType() + "\"\n");
                json.write("  }" + (i < logs.size() - 1 ? "," : "") + "\n");
            }
            json.write("]");

            // CSV export (message-only)
            // CSV export (include all fields)
            csv.write("Timestamp,Status,Message,Screenshot,Expected,TestType,Comment\n");
            for (LogEntry log : logs) {
                csv.write(String.format("\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\"\n",
                        log.getTimestamp(),
                        log.getStatus(),
                        log.getMessage().replace("\"", "\"\""),
                        log.getScreenshotFile() != null ? log.getScreenshotFile() : "",
                        log.getExpectedResult() != null ? log.getExpectedResult() : "",
                        log.getTestType() != null ? log.getTestType() : "",
                        log.getComment() != null ? log.getComment() : ""));
            }

            // ZIP bundle
            try (ZipOutputStream zipOut = new ZipOutputStream(new FileOutputStream(zipPath))) {
                for (String path : List.of(htmlPath, jsonPath, csvPath)) {
                    File file = new File(path);
                    if (file.exists()) {
                        zipOut.putNextEntry(new ZipEntry(file.getName()));
                        zipOut.write(Files.readAllBytes(file.toPath()));
                        zipOut.closeEntry();
                    }
                }
            }

        } catch (IOException e) {
            e.printStackTrace();
        }

        Map<String, Object> response = new HashMap<>();
        response.put("reportUrl", config.getReportUrlPrefix() + baseName + ".html");
        response.put("reportZip", config.getReportUrlPrefix() + baseName + ".zip");
        response.put("message", "✅ Tests completed with " + logs.size() + " steps.");
        return response;
    }
}
