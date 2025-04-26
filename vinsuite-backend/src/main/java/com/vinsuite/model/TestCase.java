package com.vinsuite.model;

import jakarta.persistence.*;

@Entity
@Table(name = "test_cases")
public class TestCase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String action;
    private String expectedResult;
    private String actualResult;
    private String comments;

    @ManyToOne
    @JoinColumn(name = "project_id")
    private Project project;

    // Default constructor (required by JPA)
    public TestCase() {}

    // Full constructor (used when saving to DB with project)
    public TestCase(String action, String expectedResult, String actualResult, String comments, Project project) {
        this.action = action;
        this.expectedResult = expectedResult;
        this.actualResult = actualResult;
        this.comments = comments;
        this.project = project;
    }

    // Constructor for AI-generated test cases (no project)
    public TestCase(String action, String expectedResult, String actualResult, String comments) {
        this.action = action;
        this.expectedResult = expectedResult;
        this.actualResult = actualResult;
        this.comments = comments;
    }

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public String getExpectedResult() {
        return expectedResult;
    }

    public void setExpectedResult(String expectedResult) {
        this.expectedResult = expectedResult;
    }

    public String getActualResult() {
        return actualResult;
    }

    public void setActualResult(String actualResult) {
        this.actualResult = actualResult;
    }

    public String getComments() {
        return comments;
    }

    public void setComments(String comments) {
        this.comments = comments;
    }

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }
}
