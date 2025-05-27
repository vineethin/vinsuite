package com.vinsuite.controller.dev;

import com.vinsuite.service.writer.CodeSummarizerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/writer")
public class WriterController {

    @Autowired
    private CodeSummarizerService codeSummarizerService;

    @PostMapping("/summarize-code")
    public ResponseEntity<?> summarizeCode(@RequestBody Map<String, String> payload) {
        String code = payload.get("code");

        if (code == null || code.trim().length() < 5) {
            return ResponseEntity.badRequest().body(Map.of("summary", "❌ Invalid code input."));
        }

        String summary = codeSummarizerService.summarizeCode(code);
        System.out.println("✅ Summary returned: " + summary); // Optional logging

        return ResponseEntity.ok(Map.of("summary", summary));
    }
}
