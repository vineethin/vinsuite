package com.vinsuite.controller;

import com.vinsuite.model.Project;
import com.vinsuite.model.TestCase;
import com.vinsuite.repository.ProjectRepository;
import com.vinsuite.repository.TestCaseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/testcases")
public class TestCaseController {

    @Autowired
    private TestCaseRepository testCaseRepository;

    @Autowired
    private ProjectRepository projectRepository;

    // Create a new test case under a project
    @PostMapping
    public TestCase createTestCase(@RequestBody TestCaseRequest request) {
        Project project = projectRepository.findById(request.getProjectId())
                .orElseThrow(() -> new RuntimeException("Project not found"));

        TestCase testCase = request.getTestCase();
        testCase.setProject(project);
        return testCaseRepository.save(testCase);
    }

    // Get all test cases for a project
    @GetMapping("/project/{projectId}")
    public List<TestCase> getTestCasesByProject(@PathVariable Long projectId) {
        return testCaseRepository.findByProjectId(projectId);
    }

    // DTO class
    public static class TestCaseRequest {
        private Long projectId;
        private TestCase testCase;

        public Long getProjectId() {
            return projectId;
        }

        public void setProjectId(Long projectId) {
            this.projectId = projectId;
        }

        public TestCase getTestCase() {
            return testCase;
        }

        public void setTestCase(TestCase testCase) {
            this.testCase = testCase;
        }
    }
}
