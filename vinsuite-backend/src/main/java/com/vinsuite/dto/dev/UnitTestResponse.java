// src/main/java/com/vinsuite/dto/dev/UnitTestResponse.java
package com.vinsuite.dto.dev;

public class UnitTestResponse {
    private String testCode;

    public UnitTestResponse(String testCode) {
        this.testCode = testCode;
    }

    public String getTestCode() {
        return testCode;
    }

    public void setTestCode(String testCode) {
        this.testCode = testCode;
    }
}
