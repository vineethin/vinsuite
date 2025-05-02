package com.vinsuite.dto.qa;

import java.util.List;

public class CoverageEstimateRequest {

    private List<String> userStories;
    private List<String> testCases;
    private boolean deepMode;

    // ✅ FIXED: match frontend's nested structure
    private List<List<String>> acceptanceCriteria;
    private List<List<String>> testCaseSteps;

    public List<String> getUserStories() {
        return userStories;
    }

    public void setUserStories(List<String> userStories) {
        this.userStories = userStories;
    }

    public List<String> getTestCases() {
        return testCases;
    }

    public void setTestCases(List<String> testCases) {
        this.testCases = testCases;
    }

    public boolean isDeepMode() {
        return deepMode;
    }

    public void setDeepMode(boolean deepMode) {
        this.deepMode = deepMode;
    }

    public List<List<String>> getAcceptanceCriteria() {
        return acceptanceCriteria;
    }

    public void setAcceptanceCriteria(List<List<String>> acceptanceCriteria) {
        this.acceptanceCriteria = acceptanceCriteria;
    }

    public List<List<String>> getTestCaseSteps() {
        return testCaseSteps;
    }

    public void setTestCaseSteps(List<List<String>> testCaseSteps) {
        this.testCaseSteps = testCaseSteps;
    }
}
