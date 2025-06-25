package com.vinsuite.dto.qa;

import java.util.List;

public class RunTestRequest {
    private String url;
    private List<String> tests;
    private String username;
    private String password;

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

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
