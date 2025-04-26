package com.vinsuite.repository;

import com.vinsuite.model.TestCase;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TestCaseRepository extends JpaRepository<TestCase, Long> {
    List<TestCase> findByProjectId(Long projectId);
}
