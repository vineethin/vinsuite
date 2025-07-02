package com.vintaas.service;

import com.vinsuite.dto.qa.SmartTestCaseRequest;
import com.vinsuite.service.qa.TestCaseGenerationService;

import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;
import org.springframework.http.ResponseEntity;
import org.springframework.test.util.ReflectionTestUtils;

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
    public void shouldReturnResponse_whenGenerateTestCasesFromTextGivenValidInput() {
        Map<String, String> request = Map.of("feature", "Login with username and password");

        ResponseEntity<?> response = service.generateTestCasesFromText(request);

        assertNotNull(response, "Response should not be null");
        assertEquals(response.getStatusCodeValue(), 200, "Should return 200 OK");
        assertNotNull(response.getBody(), "Response body should not be null");
        assertTrue(response.getBody().toString().contains("testCases") ||
                   response.getBody().toString().length() > 0,
                   "Expected generated test cases or valid output");
    }

    @Test
    public void shouldReturn500_whenSmartTestCaseImageIsInvalidBase64() {
        SmartTestCaseRequest request = new SmartTestCaseRequest();
        request.setFeatureText("Login to application");
        request.setImageBase64("data:image/png;base64,INVALIDDATA");

        ResponseEntity<?> response = service.generateSmartTestCasesFromImage(request);

        assertNotNull(response, "Response should not be null");
        assertEquals(response.getStatusCodeValue(), 500, "Invalid image input should return 500");
        assertTrue(response.getBody().toString().toLowerCase().contains("error") ||
                   response.getBody().toString().toLowerCase().contains("invalid"),
                   "Should contain error message or indication of failure");
    }
}
