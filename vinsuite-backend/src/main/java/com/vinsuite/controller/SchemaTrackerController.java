package com.vinsuite.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.*;

@RestController
@RequestMapping("/api/dba")
public class SchemaTrackerController {

    @PostMapping("/upload-schema-log")
    public List<String> uploadLog(@RequestParam("file") MultipartFile file) {
        try {
            List<String> changes = new ArrayList<>();
            BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream()));
            String line;
            while ((line = reader.readLine()) != null) {
                changes.add(line);
            }
            return changes;
        } catch (Exception e) {
            throw new RuntimeException("Failed to read log file: " + e.getMessage());
        }
    }
}
