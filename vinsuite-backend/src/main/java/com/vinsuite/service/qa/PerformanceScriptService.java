package com.vinsuite.service.qa;

import com.vinsuite.dto.qa.PerformanceRequest;
import org.springframework.stereotype.Service;

@Service
public class PerformanceScriptService {

    public String generateScript(PerformanceRequest request) {
        // For now, return a very basic dummy JMeter test plan XML (string)
        return String.format("""
            <?xml version="1.0" encoding="UTF-8"?>
            <jmeterTestPlan version="1.2" properties="5.0" jmeter="5.4.1">
              <hashTree>
                <TestPlan guiclass="TestPlanGui" testclass="TestPlan" testname="Generated Test Plan" enabled="true">
                  <stringProp name="TestPlan.comments">%s</stringProp>
                  <boolProp name="TestPlan.functional_mode">false</boolProp>
                </TestPlan>
                <hashTree>
                  <ThreadGroup guiclass="ThreadGroupGui" testclass="ThreadGroup" testname="User Load" enabled="true">
                    <stringProp name="ThreadGroup.num_threads">%d</stringProp>
                    <stringProp name="ThreadGroup.ramp_time">%d</stringProp>
                    <stringProp name="ThreadGroup.duration">%d</stringProp>
                  </ThreadGroup>
                </hashTree>
              </hashTree>
            </jmeterTestPlan>
            """, request.getTestCase(), request.getUsers(), request.getRampUp(), request.getDuration());
    }
}
