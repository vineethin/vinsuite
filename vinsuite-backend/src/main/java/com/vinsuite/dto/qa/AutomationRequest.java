package com.vinsuite.dto.qa;

/**
 * DTO for handling automated test generation input, including:
 * - manual test case steps
 * - corresponding HTML code
 * - target language and framework
 */
public class AutomationRequest {

    private String manualSteps;
    private String testCase;
    private String htmlCode;
    private String language;
    private String framework;

    public String getManualSteps() {
        return manualSteps;
    }

    public void setManualSteps(String manualSteps) {
        this.manualSteps = manualSteps;
    }

    public String getTestCase() {
        return testCase;
    }

    public void setTestCase(String testCase) {
        this.testCase = testCase;
    }

    public String getHtmlCode() {
        return htmlCode;
    }

    public void setHtmlCode(String htmlCode) {
        this.htmlCode = htmlCode;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public String getFramework() {
        return framework;
    }

    public void setFramework(String framework) {
        this.framework = framework;
    }

    @Override
    public String toString() {
        return "AutomationRequest{" +
                "manualSteps='" + manualSteps + '\'' +
                ", testCase='" + testCase + '\'' +
                ", htmlCode='" + htmlCode + '\'' +
                ", language='" + language + '\'' +
                ", framework='" + framework + '\'' +
                '}';
    }
}
