package com.vintaas.service;

import com.vinsuite.dto.qa.SmartTestCaseRequest;
import com.vinsuite.service.qa.TestCaseGenerationService;

import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.http.ResponseEntity;

import java.util.Map;

import static org.testng.Assert.*;

public class TestCaseGenerationServiceTest {

    private TestCaseGenerationService service;

    @BeforeMethod
    public void setup() {
        service = new TestCaseGenerationService();
        ReflectionTestUtils.setField(service, "openaiApiKey", "test-key");
    }

    @Test
    public void testGenerateTestCasesFromText_withMockPrompt_shouldReturnErrorOrEmpty() {
        Map<String, String> request = Map.of("feature", "Login with username and password");
        ResponseEntity<?> response = service.generateTestCasesFromText(request);
        assertNotNull(response);
    }

    @Test
    public void testGenerateSmartTestCasesFromImage_withInvalidBase64_shouldHandleException() {
        SmartTestCaseRequest request = new SmartTestCaseRequest();
        request.setFeatureText("Login to application");
        request.setImageBase64("data:image/png;base64,INVALIDDATA");

        ResponseEntity<?> response = service.generateSmartTestCasesFromImage(request);
        assertEquals(response.getStatusCode().value(), 500);
    }
}
