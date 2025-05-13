package com.vinsuite.controller.qa;

import com.vinsuite.dto.qa.PerformanceRequest;
import com.vinsuite.service.qa.PerformanceScriptService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/qa/performance")
public class PerformanceScriptController {

    @Autowired
    private PerformanceScriptService performanceScriptService;

    @PostMapping("/generate")
    public Map<String, String> generate(@RequestBody PerformanceRequest request) {
        String script = performanceScriptService.generateScript(request);

        Map<String, String> response = new HashMap<>();
        response.put("script", script);
        return response;
    }
}
