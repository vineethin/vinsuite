package com.vinsuite.service.qa;

/**
 * Represents a single UI action step parsed from a test description.
 */
public class ActionStep {
    private String actionType; // e.g., enter, click, check, select
    private String selectorType; // e.g., id, xpath, css
    private String selectorValue; // the value of the selector
    private String textValue; // optional (used for input actions)

    // Optional no-arg constructor (good for JSON serialization/deserialization)
    public ActionStep() {
    }

    public ActionStep(String actionType, String selectorType, String selectorValue, String textValue) {
        this.actionType = actionType;
        this.selectorType = selectorType;
        this.selectorValue = selectorValue;
        this.textValue = textValue;
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

    public void setTextValue(String textValue) {
        this.textValue = textValue;
    }

    @Override
    public String toString() {
        return actionType.toUpperCase() +
                (textValue != null ? " '" + textValue + "'" : "") +
                " in " + selectorType + "='" + selectorValue + "'";
    }
}
