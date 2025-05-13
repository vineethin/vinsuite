package com.vinsuite.dto.qa;

public class PerformanceRequest {
    private String testCase;
    private String tool;
    private int users;
    private int rampUp;
    private int duration;

    // Getters and Setters
    public String getTestCase() { return testCase; }
    public void setTestCase(String testCase) { this.testCase = testCase; }

    public String getTool() { return tool; }
    public void setTool(String tool) { this.tool = tool; }

    public int getUsers() { return users; }
    public void setUsers(int users) { this.users = users; }

    public int getRampUp() { return rampUp; }
    public void setRampUp(int rampUp) { this.rampUp = rampUp; }

    public int getDuration() { return duration; }
    public void setDuration(int duration) { this.duration = duration; }
}
