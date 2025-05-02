package com.vintaas.service;

import org.testng.annotations.Test;

import com.vinsuite.service.qa.PageFactoryGeneratorService;

import org.springframework.http.ResponseEntity;

import static org.testng.Assert.*;

public class PageFactoryGeneratorServiceTest {

    private final PageFactoryGeneratorService service = new PageFactoryGeneratorService();

    @Test
    public void testGenerateFromHtml_withValidInput_shouldReturnJavaCode() {
        String html = "<input id='username' /><input id='password' /><button>Login</button>";
        ResponseEntity<?> response = service.generateFromHtml(html);
        assertTrue(response.getBody().toString().contains("PageObjectClass"));
    }

    @Test
    public void testGenerateFromHtml_withEmptyInput_shouldReturnBadRequest() {
        ResponseEntity<?> response = service.generateFromHtml("");
        assertEquals(response.getStatusCodeValue(), 400);
    }
}
