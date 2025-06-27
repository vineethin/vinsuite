package com.vinsuite.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class TestAuraConfig {

    @Value("${testaura.report.dir}")
    private String reportDir;

    @Value("${testaura.chrome.headless}")
    private boolean headless;

    public String getReportDir() {
        return reportDir;
    }

    public boolean isHeadless() {
        return headless;
    }

    @Value("${testaura.chrome.headless:true}")
    private boolean chromeHeadless;

    public boolean isChromeHeadless() {
        return chromeHeadless;
    }
}
