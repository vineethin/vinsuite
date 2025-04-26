package com.vinsuite.controller;

import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/dba")
public class BackupStatusController {

    @GetMapping("/backup-status")
    public List<Map<String, Object>> getBackupStatus() {
        return List.of(
            Map.of("server", "DB-Prod-01", "status", "✅ Success", "lastRun", "2025-04-25 03:00 AM"),
            Map.of("server", "DB-Backup-02", "status", "❌ Failed", "lastRun", "2025-04-25 02:00 AM"),
            Map.of("server", "DB-Stage-03", "status", "✅ Success", "lastRun", "2025-04-24 11:30 PM")
        );
    }
}
