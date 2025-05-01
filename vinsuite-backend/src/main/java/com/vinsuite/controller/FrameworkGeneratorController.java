package com.vinsuite.controller;

import com.vinsuite.dto.FrameworkConfigRequest;
import com.vinsuite.service.FrameworkGeneratorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/qa/framework")
public class FrameworkGeneratorController {

    @Autowired
    private FrameworkGeneratorService generatorService;

    @PostMapping("/generate")
    public ResponseEntity<byte[]> generateFramework(@RequestBody FrameworkConfigRequest config) {
        System.out.println("🎯 HIT /api/qa/framework/generate endpoint with config: " + config);

        try {
            byte[] zipBytes = generatorService.generateFramework(config);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            headers.setContentDisposition(ContentDisposition.attachment()
                    .filename("sample-framework.zip")
                    .build());

            return new ResponseEntity<>(zipBytes, headers, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
}
