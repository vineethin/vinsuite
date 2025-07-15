package com.vinsuite.service.qa;

import java.util.*;
import java.util.regex.*;

public class ActionStepParser {

    private final Pattern compoundEnter = Pattern.compile(
            "(?i)enter\\s+(.*?)\\s+in\\s+(xpath|css|id|label|name)\\((['\"])(.+?)\\3\\)\\s+and\\s+(.*?)\\s+in\\s+(xpath|css|id|label|name)\\((['\"])(.+?)\\7\\)");

    private final Pattern groqNatural = Pattern.compile(
            "(?i)(click|enter|type|check|select)\\s+(.*?)\\s+in\\s+(xpath|css|id|label|name)\\((['\"])(.+?)\\4\\)( and press Enter)?");

    private final Pattern groqSimpleClick = Pattern.compile(
            "(?i)^click( on)?\\s+(xpath|css|id|label|name)\\((['\"])(.+?)\\3\\)$");

    private final Pattern groqLeaveEmpty = Pattern.compile(
            "(?i)^leave\\s+(xpath|css|id|label|name)\\((['\"])(.+?)\\2\\)\\s+empty$");

    private final Pattern pressEnter = Pattern.compile("(?i)^press enter$");

    // ✅ Re-added strict pattern for backward compatibility
    private final Pattern strictEnter = Pattern
            .compile("(?i)(enter|type)\\s+'([^']+)'\\s+in\\s+(id|xpath|css|name)='([^']+)'");
    private final Pattern strictClick = Pattern.compile("(?i)(click|check|select)\\s+(id|xpath|css|name)='([^']+)'");
    private final Pattern fallback = Pattern.compile("(?i)([a-zA-Z0-9_\\-]+)\\s+in\\s+(id|xpath|css|name)='([^']+)'");

    public List<ActionStep> parseActionSteps(String action, String testType, Map<String, String> placeholders) {
        List<ActionStep> steps = new ArrayList<>();
        if (action == null || action.isBlank())
            return steps;

        action = action.trim().replaceAll("\\s+", " ");
        String[] parts = action.split("(?i)\\s+and then\\s+|\\s+then\\s+|(?<!\\{)\\s+and\\s+(?!\\{)");

        for (String part : parts) {
            part = part.trim();

            // 1. Handle compound enter pattern first
            Matcher compound = compoundEnter.matcher(part);
            if (compound.find()) {
                steps.add(new ActionStep("enter", compound.group(2).toLowerCase(), compound.group(4),
                        compound.group(1).trim(), testType));
                steps.add(new ActionStep("enter", compound.group(6).toLowerCase(), compound.group(8),
                        compound.group(5).trim(), testType));

                // Continue parsing the remaining part after compound match
                continue;
            }

            // 2. Now keep matching remaining instructions in this part
            boolean matchedSomething;
            do {
                matchedSomething = false;

                Matcher nat = groqNatural.matcher(part);
                if (nat.find()) {
                    String verb = nat.group(1).toLowerCase();
                    String value = nat.group(2).trim().replaceAll("^['\"]|['\"]$", "");
                    String selType = nat.group(3).toLowerCase();
                    String selValue = nat.group(5).trim();

                    steps.add(new ActionStep(verb, selType, selValue, verb.equals("click") ? null : value, testType));

                    part = part.substring(nat.end()).trim();
                    matchedSomething = true;
                    continue;
                }

                Matcher simpleClick = groqSimpleClick.matcher(part);
                if (simpleClick.find()) {
                    String selType = simpleClick.group(2).toLowerCase();
                    String selValue = simpleClick.group(4).trim();

                    steps.add(new ActionStep("click", selType, selValue, null, testType));

                    part = part.substring(simpleClick.end()).trim();
                    matchedSomething = true;
                    continue;
                }

                Matcher leave = groqLeaveEmpty.matcher(part);
                if (leave.find()) {
                    String selType = leave.group(1).toLowerCase();
                    String selValue = leave.group(3).trim();

                    steps.add(new ActionStep("enter", selType, selValue, "", testType));

                    part = part.substring(leave.end()).trim();
                    matchedSomething = true;
                    continue;
                }

                if (pressEnter.matcher(part).matches()) {
                    steps.add(new ActionStep("keypress", "keyboard", "Enter", null, testType));
                    part = "";
                    matchedSomething = true;
                    continue;
                }

                Matcher m1 = strictEnter.matcher(part);
                if (m1.find()) {
                    steps.add(new ActionStep("enter", m1.group(3).toLowerCase(), m1.group(4), m1.group(2), testType));
                    part = part.substring(m1.end()).trim();
                    matchedSomething = true;
                    continue;
                }

                Matcher m2 = strictClick.matcher(part);
                if (m2.find()) {
                    steps.add(new ActionStep("click", m2.group(2).toLowerCase(), m2.group(3), null, testType));
                    part = part.substring(m2.end()).trim();
                    matchedSomething = true;
                    continue;
                }

                Matcher fb = fallback.matcher(part);
                if (fb.find()) {
                    String value = fb.group(1).trim();
                    String selType = fb.group(2).toLowerCase();
                    String selValue = fb.group(3).trim();

                    steps.add(new ActionStep("enter", selType, selValue, value, testType));
                    part = part.substring(fb.end()).trim();
                    matchedSomething = true;
                    continue;
                }
                Matcher valueInSelector = Pattern
                        .compile("^['\"]?(.*?)['\"]?\\s+in\\s+(id|name|xpath|css|label)\\([\"'](.+?)[\"']\\)$")
                        .matcher(part);
                if (valueInSelector.find()) {
                    steps.add(new ActionStep(
                            "enter",
                            valueInSelector.group(2).toLowerCase(),
                            valueInSelector.group(3).trim(),
                            valueInSelector.group(1).trim(),
                            testType));
                    part = part.substring(valueInSelector.end()).trim();
                    matchedSomething = true;
                    continue;
                }

            } while (matchedSomething && !part.isEmpty());

            if (!matchedSomething && !part.isEmpty()) {
                System.out.println("[WARN] Parser failed for: " + part);
            }
        }

        return steps;
    }
}
