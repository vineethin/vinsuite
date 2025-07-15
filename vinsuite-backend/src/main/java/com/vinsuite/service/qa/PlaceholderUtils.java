package com.vinsuite.service.qa;

import java.util.Map;

public class PlaceholderUtils {

    public static String resolve(String action, Map<String, String> placeholders) {
        if (action == null || placeholders == null) return action;

        String resolved = action;

        for (Map.Entry<String, String> entry : placeholders.entrySet()) {
            String key = entry.getKey();
            String value = entry.getValue() != null ? entry.getValue() : "";

            // Special case: handle "{{KEY}} as very long string"
            resolved = resolved.replace("{{" + key + "}} as very long string", value + "x".repeat(100));

            // Special case: handle "{{PASSWORD}} as null"
            if (key.equalsIgnoreCase("PASSWORD")) {
                resolved = resolved.replace("{{" + key + "}} as null", "");
            }

            // Standard replacement
            resolved = resolved.replace("{{" + key + "}}", value);
        }

        return resolved;
    }
}
