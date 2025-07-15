package com.vinsuite.dto.qa;

public class LogEntry {
    private String timestamp;
    private String status; // e.g. "INFO", "PASS", "FAIL", "STEP", "WARN"
    private String message;
    private String screenshotFile; // optional
    private String expectedResult;
    private String note;
    private String testType;
    private String comment;
    private String category;

    public LogEntry() {
    }

    // ✅ Updated constructor to include comment
    public LogEntry(String timestamp, String status, String message, String screenshotFile, String expectedResult,
            String note, String testType, String comment, String category) {
        this.timestamp = timestamp;
        this.status = status;
        this.message = message;
        this.screenshotFile = screenshotFile;
        this.expectedResult = expectedResult;
        this.note = note;
        this.testType = testType;
        this.comment = comment;
        this.category = category;
    }

    // ✅ Getters and Setters
    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getScreenshotFile() {
        return screenshotFile;
    }

    public void setScreenshotFile(String screenshotFile) {
        this.screenshotFile = screenshotFile;
    }

    public String getExpectedResult() {
        return expectedResult;
    }

    public void setExpectedResult(String expectedResult) {
        this.expectedResult = expectedResult;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public String getTestType() {
        return testType;
    }

    public void setTestType(String testType) {
        this.testType = testType;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }
}
