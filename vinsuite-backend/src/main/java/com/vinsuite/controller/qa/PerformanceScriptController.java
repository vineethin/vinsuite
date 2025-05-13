package com.vinsuite.controller.qa;

import com.vinsuite.dto.qa.PerformanceRequest;
import com.vinsuite.service.qa.PerformanceScriptService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.HttpURLConnection;
import java.net.URL;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/qa/performance")
public class PerformanceScriptController {

    @Autowired
    private PerformanceScriptService performanceScriptService;

    @Value("${groq.api.key}")
    private String groqApiKey; // ✅ Injected Groq key from application.properties

    @PostMapping("/generate")
    public Map<String, String> generate(@RequestBody PerformanceRequest request) {
        String script = performanceScriptService.generateScript(request);

        Map<String, String> response = new HashMap<>();
        response.put("script", script);
        return response;
    }

    @PostMapping("/test")
    public ResponseEntity<?> testPerformance(@RequestBody PerformanceRequest request) {
        if (!isUrlReachable(request.getUrl())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("The provided URL is not reachable from the VinSuite server.");
        }

        String result = performanceScriptService.runPerformanceTest(request);

        Map<String, String> response = new HashMap<>();
        response.put("summary", result);
        return ResponseEntity.ok(response);
    }

    private boolean isUrlReachable(String urlStr) {
        try {
            URL url = new URL(urlStr);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("HEAD");
            conn.setConnectTimeout(3000);
            conn.setReadTimeout(3000);
            int responseCode = conn.getResponseCode();
            return responseCode >= 200 && responseCode < 400;
        } catch (Exception e) {
            return false;
        }
    }
}
