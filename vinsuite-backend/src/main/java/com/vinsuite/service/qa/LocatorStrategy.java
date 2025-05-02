package com.vinsuite.service.qa;

public enum LocatorStrategy {
    ID("id", "By.ID"),
    NAME("name", "By.NAME"),
    CSS("css", "By.CSS_SELECTOR"),
    XPATH("xpath", "By.XPATH"),
    LINK_TEXT("linkText", "By.LINK_TEXT"),
    PARTIAL_LINK_TEXT("partialLinkText", "By.PARTIAL_LINK_TEXT"),
    TAG_NAME("tagName", "By.TAG_NAME");

    private final String key;
    private final String pythonBy;

    LocatorStrategy(String key, String pythonBy) {
        this.key = key;
        this.pythonBy = pythonBy;
    }

    public static String toPythonTuple(String findByAnnotation) {
        for (LocatorStrategy strategy : values()) {
            if (findByAnnotation.contains(strategy.key + " =")) {
                String val = extractValue(findByAnnotation, strategy.key);
                return "(" + strategy.pythonBy + ", \"" + val + "\")";
            }
        }
        return "(By.ID, \"\")"; // Default fallback
    }

    private static String extractValue(String locator, String strategy) {
        String prefix = strategy + " = \"";
        int start = locator.indexOf(prefix);
        if (start == -1) return "";
        start += prefix.length();
        int end = locator.indexOf("\"", start);
        if (end == -1) return locator.substring(start);
        return locator.substring(start, end);
    }

    public static String toCSharpFindsBy(String findByAnnotation) {
        for (LocatorStrategy strategy : values()) {
            if (findByAnnotation.contains(strategy.key + " =")) {
                String val = extractValue(findByAnnotation, strategy.key);
                return String.format("[FindsBy(%s = \"%s\")]", strategy.name(), val);
            }
        }
        return "[FindsBy(Id = \"\")]"; // Default fallback
    }
    
}
