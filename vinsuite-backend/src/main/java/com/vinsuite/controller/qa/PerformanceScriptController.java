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
import java.util.Map;

@RestController
@RequestMapping("/api/qa/performance")
public class PerformanceScriptController {

    @Autowired
    private PerformanceScriptService performanceScriptService;

    @Value("${groq.api.key}")
    private String groqApiKey;

    @PostMapping("/generate")
    public ResponseEntity<Map<String, String>> generateScript(@RequestBody PerformanceRequest request) {
        String script = performanceScriptService.generateScript(request);
        return ResponseEntity.ok(Map.of("script", script));
    }

    @PostMapping("/test")
    public ResponseEntity<?> testPerformance(@RequestBody PerformanceRequest request) {
        if (request.getUrl() == null || !isUrlReachable(request.getUrl())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "❌ The provided URL is not reachable from the VinSuite server."));
        }

        // Simulate performance summary
        String result = performanceScriptService.runPerformanceTest(request);

        // Updated: Use only 'stages' instead of both 'vus' and 'duration'
        String script = String.format("""
            import http from 'k6/http';
            import { sleep } from 'k6';

            export let options = {
              stages: [
                { duration: '%ds', target: %d },
                { duration: '%ds', target: %d }
              ]
            };

            export default function () {
              http.get('%s');
              sleep(1);
            }
            """,
            request.getRampUp(), request.getUsers(),
            request.getDuration(), request.getUsers(),
            request.getUrl()
        );

        return ResponseEntity.ok(Map.of(
                "summary", result,
                "script", script
        ));
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
