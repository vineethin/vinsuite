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
        switch (language.toLowerCase()) {
            case "javascript":
                return "Generate unit test cases in Jest for the following JavaScript function:\n\n" + code;
            case "python":
                return "Generate unit test cases in Pytest for the following Python function:\n\n" + code;
            case "java":
                return "Generate unit test cases in JUnit 5 for the following Java method:\n\n" + code;
            case "csharp":
            case "c#":
                return "Generate unit test cases in NUnit for the following C# method:\n\n" + code;
            case "go":
                return "Generate unit test cases using Go's testing package for the following function:\n\n" + code;
            case "typescript":
                return "Generate unit test cases in Jest for the following TypeScript function:\n\n" + code;
            case "kotlin":
                return "Generate unit test cases in JUnit 5 for the following Kotlin method:\n\n" + code;
            case "swift":
                return "Generate unit test cases using XCTest for the following Swift function:\n\n" + code;

            default:
                return "Generate unit test cases for the following function:\n\n" + code;
        }
    }

}
