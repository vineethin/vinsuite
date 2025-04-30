package com.vinsuite.controller;

import com.vinsuite.dto.FrameworkConfigRequest;
import com.vinsuite.service.FrameworkGeneratorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Map;

@RestController
@RequestMapping("/api/qa/framework")
public class FrameworkGeneratorController {

    private static final Logger log = LoggerFactory.getLogger(FrameworkGeneratorController.class);

    @Autowired
    private FrameworkGeneratorService generatorService;

    @PostMapping("/generate")
    public ResponseEntity<byte[]> generateFramework(@RequestBody Map<String, String> payload) {
        String language = payload.getOrDefault("language", "java");
        String testFramework = payload.getOrDefault("testFramework", "testng");

        try {
            FrameworkConfigRequest config = new FrameworkConfigRequest(language, testFramework);
            byte[] zipBytes = generatorService.generateFramework(config);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            headers.setContentDisposition(ContentDisposition.attachment().filename("sample-framework.zip").build());

            return new ResponseEntity<>(zipBytes, headers, HttpStatus.OK);
        } catch (Exception e) {
            log.error("❌ Framework generation failed", e); // 🔁 Logging instead of printStackTrace
            return ResponseEntity.internalServerError().build();
        }
    }
}