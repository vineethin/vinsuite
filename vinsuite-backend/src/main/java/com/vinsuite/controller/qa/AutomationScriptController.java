package com.vinsuite.controller.qa;

import com.vinsuite.dto.qa.AutomationRequest;
import com.vinsuite.service.qa.FrameworkGeneratorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/qa/framework")
public class AutomationScriptController {

    @Autowired
    private FrameworkGeneratorService generatorService;

    @PostMapping("/generate-script")
    public ResponseEntity<String> generateScript(@RequestBody AutomationRequest request) {
        System.out.println("\uD83E\uDDEA HIT /api/qa/framework/generate-script with: " + request);
        try {
            String script = generatorService.generateTestScript(
                request.getManualSteps(),
                request.getHtmlCode(),
                request.getLanguage(),
                request.getFramework()
            );
            return ResponseEntity.ok(script);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                                 .body("Failed to generate script: " + e.getMessage());
        }
    }
}
