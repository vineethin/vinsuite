package com.vinsuite.dto.qa;

public class LogEntry {
    private String timestamp;
    private String status; // e.g. "INFO", "PASS", "FAIL", "STEP", "WARN"
    private String message;
    private String screenshotFile; // optional

    public LogEntry() {
    }

    public LogEntry(String timestamp, String status, String message, String screenshotFile) {
        this.timestamp = timestamp;
        this.status = status;
        this.message = message;
        this.screenshotFile = screenshotFile;
    }

    // Getters and Setters

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
}
