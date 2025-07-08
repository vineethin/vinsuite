package com.vinsuite.service.qa;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class ActionStepParser {

    public List<ActionStep> parseActionSteps(String action) {
        List<ActionStep> steps = new ArrayList<>();
        if (action == null || action.isBlank())
            return steps;

        action = action.trim().replaceAll("\\s+", " ");
        String[] parts = action.split("(?i)\\s+and then\\s+|\\s+then\\s+|\\s+and\\s+");

        // ✅ Strict Java-style: enter 'abc' in id='...'
        Pattern strictEnter = Pattern.compile("(?i)(enter|type)\\s+'([^']+)'\\s+in\\s+(id|xpath|css|name)='([^']+)'");
        Pattern strictClick = Pattern.compile("(?i)(click|check|select)\\s+(id|xpath|css|name)='([^']+)'");
        Pattern fallback = Pattern.compile("'([^']+)'\\s+in\\s+(id|xpath|css|name)='([^']+)'", Pattern.CASE_INSENSITIVE);

        // ✅ Groq-style: enter ... in xpath("...") and press Enter
        Pattern groqNatural = Pattern.compile(
                "(?i)(click|enter|type|check|select)\\s+(.*?)\\s+in\\s+(xpath|css|id|label|name)\\((['\"])(.+?)\\4\\)( and press Enter)?");

        // ✅ Groq-style: click on xpath("...")
        Pattern groqSimpleClick = Pattern.compile("(?i)^click( on)?\\s+(xpath|css|id|label|name)\\((['\"])(.+?)\\3\\)$");

        // ✅ Groq-style: leave xpath("...") empty
        Pattern groqLeaveEmpty = Pattern.compile("(?i)^leave\\s+(xpath|css|id|label|name)\\((['\"])(.+?)\\2\\)\\s+empty$");

        // ✅ Standalone press
        Pattern pressEnter = Pattern.compile("(?i)^press enter$");

        for (String part : parts) {
            part = part.trim();

            // 1. Strict: enter 'value' in id='foo'
            Matcher m1 = strictEnter.matcher(part);
            if (m1.find()) {
                steps.add(new ActionStep("enter", m1.group(3).toLowerCase(), m1.group(4), m1.group(2)));
                continue;
            }

            // 2. Strict: click id='foo'
            Matcher m2 = strictClick.matcher(part);
            if (m2.find()) {
                steps.add(new ActionStep(m2.group(1).toLowerCase(), m2.group(2).toLowerCase(), m2.group(3), null));
                continue;
            }

            // 3. Fallback: 'abc' in xpath='...'
            Matcher fallbackMatcher = fallback.matcher(part);
            if (fallbackMatcher.find()) {
                steps.add(new ActionStep("enter", fallbackMatcher.group(2).toLowerCase(), fallbackMatcher.group(3),
                        fallbackMatcher.group(1)));
                continue;
            }

            // 4. Groq full: action value in xpath("...") [and press enter]
            Matcher gn = groqNatural.matcher(part);
            if (gn.find()) {
                String actionType = gn.group(1).toLowerCase();
                String textValue = gn.group(2).trim();
                String selectorType = gn.group(3).toLowerCase();
                String selectorValue = gn.group(5);
                String extra = gn.group(6);

                if ("xpath".equals(selectorType)) {
                    selectorValue = selectorValue.replaceAll("^/*", "//");
                }

                if (actionType.equals("enter") || actionType.equals("type")) {
                    steps.add(new ActionStep("enter", selectorType, selectorValue, textValue));
                } else {
                    steps.add(new ActionStep("click", selectorType, selectorValue, null));
                }

                if (extra != null && extra.toLowerCase().contains("enter")) {
                    steps.add(new ActionStep("press_enter", selectorType, selectorValue, null));
                }
                continue;
            }

            // 5. Groq simple click
            Matcher clickOnly = groqSimpleClick.matcher(part);
            if (clickOnly.find()) {
                String selType = clickOnly.group(2).toLowerCase();
                String selValue = clickOnly.group(4).replaceAll("^/*", "//");
                steps.add(new ActionStep("click", selType, selValue, null));
                continue;
            }

            // 6. Leave empty
            Matcher leaveEmpty = groqLeaveEmpty.matcher(part);
            if (leaveEmpty.find()) {
                String selType = leaveEmpty.group(1).toLowerCase();
                String selValue = leaveEmpty.group(3).replaceAll("^/*", "//");
                steps.add(new ActionStep("enter", selType, selValue, ""));
                continue;
            }

            // 7. Standalone press enter
            Matcher pe = pressEnter.matcher(part);
            if (pe.find()) {
                steps.add(new ActionStep("press_enter", "", "", null));
                continue;
            }

            // 8. Fallback warning
            System.out.println("[WARN] Unrecognized step format: " + part);
        }

        return steps;
    }
}
