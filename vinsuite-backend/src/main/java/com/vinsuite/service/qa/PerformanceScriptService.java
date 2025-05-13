package com.vinsuite.service.qa;

import com.vinsuite.dto.qa.PerformanceRequest;
import org.springframework.stereotype.Service;

import java.io.*;
import java.nio.file.Files;
import java.util.stream.Collectors;

@Service
public class PerformanceScriptService {

    /**
     * This is still used for manual script generation (not test execution)
     */
    public String generateScript(PerformanceRequest request) {
        return String.format("""
            import http from 'k6/http';
            import { sleep } from 'k6';

            export let options = {
              vus: %d,
              duration: '%ds',
              thresholds: {
                http_req_duration: ['p(95)<1000']
              }
            };

            export default function () {
              http.get('%s');
              sleep(1);
            }
            """, request.getUsers(), request.getDuration(), request.getUrl());
    }

    /**
     * Runs a k6 test against the provided URL using generated script.
     */
    public String runPerformanceTest(PerformanceRequest request) {
        try {
            // Step 1: Generate script
            String script = generateScript(request);
            File tempScriptFile = File.createTempFile("k6-script-", ".js");
            Files.write(tempScriptFile.toPath(), script.getBytes());

            // Step 2: Run k6
            ProcessBuilder pb = new ProcessBuilder("k6", "run", "--quiet", tempScriptFile.getAbsolutePath());
            pb.redirectErrorStream(true);
            Process process = pb.start();

            // Step 3: Capture output
            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            String output = reader.lines().collect(Collectors.joining("\n"));

            process.waitFor();
            tempScriptFile.delete(); // Clean up

            return output;

        } catch (Exception e) {
            e.printStackTrace();
            return "❌ Error running k6 test: " + e.getMessage();
        }
    }
}
