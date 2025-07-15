package com.vinsuite.service.qa;

import java.util.Objects;

public class ActionStep {
    private String actionType; // e.g., enter, click, check, select
    private String selectorType; // e.g., id, xpath, css
    private String selectorValue; // the value of the selector
    private String textValue; // optional (used for input actions)
    private String testType; // positive, negative, or edge case

    public ActionStep(String actionType, String selectorType, String selectorValue, String textValue, String testType) {
        this.actionType = actionType;
        this.selectorType = selectorType;
        this.selectorValue = selectorValue;
        this.textValue = textValue;
        this.testType = testType; // new field for test type
    }

    public String getActionType() {
        return actionType;
    }

    public String getSelectorType() {
        return selectorType;
    }

    public String getSelectorValue() {
        return selectorValue;
    }

    public String getTextValue() {
        return textValue;
    }

    public String getTestType() {
        return testType; // new getter for testType
    }

    public void setTextValue(String textValue) {
        this.textValue = textValue;
    }

    public void setSelectorValue(String selectorValue) {
        this.selectorValue = selectorValue;
    }

    // Override equals and hashCode to account for testType
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ActionStep that = (ActionStep) o;
        return actionType.equals(that.actionType) &&
                selectorType.equals(that.selectorType) &&
                selectorValue.equals(that.selectorValue) &&
                Objects.equals(textValue, that.textValue) &&
                Objects.equals(testType, that.testType); // Compare testType
    }

    @Override
    public int hashCode() {
        return Objects.hash(actionType, selectorType, selectorValue, textValue, testType); // Include testType in hashCode
    }

    @Override
    public String toString() {
        return actionType.toUpperCase() +
                (textValue != null ? " '" + textValue + "'" : "") +
                " in " + selectorType + "='" + selectorValue + "'" +
                " [TestType: " + testType + "]"; // Add test type to toString for better debugging
    }
}


