package com.vinsuite.dto.qa;

import java.util.List;

public class RunTestRequest {
    private String url;
    private List<String> tests;

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public List<String> getTests() {
        return tests;
    }

    public void setTests(List<String> tests) {
        this.tests = tests;
    }
}
