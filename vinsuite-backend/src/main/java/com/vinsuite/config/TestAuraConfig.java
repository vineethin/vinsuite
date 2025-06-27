package com.vinsuite.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class TestAuraConfig {

    @Value("${testaura.report.dir}")
    private String reportDir;

    @Value("${testaura.chrome.headless}")
    private boolean headless;

    @Value("${testaura.report-url-prefix:/testaura/report/}")
    private String reportUrlPrefix;

    public String getReportUrlPrefix() {
        return reportUrlPrefix;
    }

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
