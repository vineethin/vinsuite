package com.vintaas.service;

import org.testng.annotations.Test;

import com.vinsuite.service.PageObjectGenerationService;

import org.springframework.http.ResponseEntity;


import static org.testng.Assert.*;

public class PageObjectGenerationServiceTest {

    private final PageObjectGenerationService service = new PageObjectGenerationService();

    private final String sampleHtml = """
        <input id="username"/>
        <input id="password"/>
        <button>Submit</button>
    """;

    @Test
    public void testGenerate_withJavaLanguage() {
        ResponseEntity<?> result = service.generate(sampleHtml, "java");
        assertTrue(result.getBody().toString().contains("PageObjectClass"));
    }

    @Test
    public void testGenerate_withPythonLanguage() {
        ResponseEntity<?> result = service.generate(sampleHtml, "python");
        assertTrue(result.getBody().toString().contains("class PageObjectClass"));
    }

    @Test
    public void testGenerate_withCSharpLanguage() {
        ResponseEntity<?> result = service.generate(sampleHtml, "csharp");
        assertTrue(result.getBody().toString().contains("public class PageObjectClass"));
    }

    @Test
    public void testGenerate_withEmptyHtml_shouldReturnBadRequest() {
        ResponseEntity<?> result = service.generate("", "java");
        assertEquals(result.getStatusCodeValue(), 400);
    }
}
