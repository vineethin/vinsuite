package com.vinsuite.service.qa;

import com.vinsuite.dto.qa.PerformanceRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.*;
import java.nio.file.Files;
import java.util.stream.Collectors;

@Service
public class PerformanceScriptService {

    @Value("${k6.executable.path}")
    private String k6Path;

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

    public String runPerformanceTest(PerformanceRequest request) {
        try {
            String script = generateScript(request);
            File tempScriptFile = File.createTempFile("k6-script-", ".js");
            Files.write(tempScriptFile.toPath(), script.getBytes());

            ProcessBuilder pb = new ProcessBuilder(k6Path, "run", "--quiet", tempScriptFile.getAbsolutePath());
            pb.redirectErrorStream(true);
            Process process = pb.start();

            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            String output = reader.lines().collect(Collectors.joining("\n"));

            process.waitFor();
            tempScriptFile.delete();

            return output;

        } catch (Exception e) {
            e.printStackTrace();
            return "❌ Error running k6 test: " + e.getMessage();
        }
    }
}
