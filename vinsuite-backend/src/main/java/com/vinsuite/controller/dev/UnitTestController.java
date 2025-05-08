// src/main/java/com/vinsuite/controller/dev/UnitTestController.java
package com.vinsuite.controller.dev;

import com.vinsuite.dto.dev.UnitTestRequest;
import com.vinsuite.dto.dev.UnitTestResponse;
import com.vinsuite.service.dev.UnitTestAIService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dev")
@CrossOrigin
public class UnitTestController {

    @Autowired
    private UnitTestAIService aiService;

    @PostMapping("/unit-test")
    public ResponseEntity<UnitTestResponse> generateUnitTest(@RequestBody UnitTestRequest request) {
        String prompt = buildPrompt(request.getCode(), request.getLanguage());
        String testCode = aiService.generateTestCode(prompt);
    
        if (testCode == null || testCode.startsWith("// Error")) {
            return ResponseEntity
                    .status(500)
                    .body(new UnitTestResponse(true, "Failed to generate test code from AI."));
        }
    
        return ResponseEntity.ok(new UnitTestResponse(testCode));
    }

    private String buildPrompt(String code, String language) {
        if ("javascript".equalsIgnoreCase(language)) {
            return "Generate unit test cases in Jest for the following JavaScript function:\n\n" + code;
        } else {
            return "Generate unit test cases in Pytest for the following Python function:\n\n" + code;
        }
    }
    
}
