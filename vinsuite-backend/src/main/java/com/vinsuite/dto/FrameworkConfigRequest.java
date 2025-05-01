package com.vinsuite.dto;

/**
 * DTO representing the configuration for framework generation.
 */
public class FrameworkConfigRequest {
    private String language;
    private String testFramework;
    private String reportTool;
    private String packagingTool;

    public FrameworkConfigRequest() {
    }

    public FrameworkConfigRequest(String language, String testFramework, String reportTool, String packagingTool) {
        this.language = language;
        this.testFramework = testFramework;
        this.reportTool = reportTool;
        this.packagingTool = packagingTool;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public String getTestFramework() {
        return testFramework;
    }

    public void setTestFramework(String testFramework) {
        this.testFramework = testFramework;
    }

    public String getReportTool() {
        return reportTool;
    }

    public void setReportTool(String reportTool) {
        this.reportTool = reportTool;
    }

    public String getPackagingTool() {
        return packagingTool;
    }

    public void setPackagingTool(String packagingTool) {
        this.packagingTool = packagingTool;
    }

    @Override
    public String toString() {
        return "FrameworkConfigRequest{" +
                "language='" + language + '\'' +
                ", testFramework='" + testFramework + '\'' +
                ", reportTool='" + reportTool + '\'' +
                ", packagingTool='" + packagingTool + '\'' +
                '}';
    }
}
