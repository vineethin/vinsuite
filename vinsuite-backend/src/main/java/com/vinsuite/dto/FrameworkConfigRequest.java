package com.vinsuite.dto;

public class FrameworkConfigRequest {
    private String language;
    private String testFramework;

    public FrameworkConfigRequest() {
    }

    public FrameworkConfigRequest(String language, String testFramework) {
        this.language = language;
        this.testFramework = testFramework;
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
}
