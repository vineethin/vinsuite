package com.vinsuite.dto.dev;

public class UnitTestResponse {
    private String testCode;
    private boolean error;
    private String message;

    // ✅ Constructors
    public UnitTestResponse() {}

    public UnitTestResponse(String testCode) {
        this.testCode = testCode;
        this.error = false;
        this.message = "Success";
    }

    public UnitTestResponse(boolean error, String message) {
        this.error = error;
        this.message = message;
        this.testCode = "";
    }

    // ✅ Getters and Setters
    public String getTestCode() {
        return testCode;
    }

    public void setTestCode(String testCode) {
        this.testCode = testCode;
    }

    public boolean isError() {
        return error;
    }

    public void setError(boolean error) {
        this.error = error;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
