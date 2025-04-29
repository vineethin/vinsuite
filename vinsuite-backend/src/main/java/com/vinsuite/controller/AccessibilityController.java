package com.vinsuite.controller;

import com.vinsuite.service.AccessibilityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/accessibility")
public class AccessibilityController {

    @Autowired
    private AccessibilityService accessibilityService;

    @PostMapping("/scan")
    public ResponseEntity<?> scanUrl(@RequestBody Map<String, String> payload) {
        String url = payload.get("url");
        return accessibilityService.scan(url);
    }
}
