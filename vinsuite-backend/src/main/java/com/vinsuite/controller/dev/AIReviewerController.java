package com.vinsuite.controller.dev;

import com.vinsuite.service.dev.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/devtools")
@CrossOrigin
public class AIReviewerController {

    @Autowired
    private AIReviewService reviewService;

    @PostMapping("/ai-review")
    public ResponseEntity<String> reviewCode(@RequestBody Map<String, String> payload) {
        String code = payload.get("code");
        String language = payload.get("language");
        return reviewService.reviewCode(code, language);
    }
}
