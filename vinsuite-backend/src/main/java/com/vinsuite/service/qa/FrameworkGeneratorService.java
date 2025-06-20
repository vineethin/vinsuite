package com.vinsuite.service.qa;

import com.vinsuite.dto.qa.FrameworkConfigRequest;
import org.springframework.stereotype.Service;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.nio.file.*;
import java.util.List;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class FrameworkGeneratorService {

    public byte[] generateFramework(FrameworkConfigRequest config) throws IOException {
        Path tempDir = Files.createTempDirectory("sample-framework");
        Path baseDir = tempDir.resolve("VinSuiteFramework");

        Files.createDirectories(baseDir);

        switch (config.getLanguage().toLowerCase()) {
            case "java" -> generateJavaFramework(baseDir, config);
            case "python" -> generatePythonFramework(baseDir, config);
            case "csharp", "c#" -> generateCsharpFramework(baseDir, config);
            default -> throw new IllegalArgumentException("Unsupported language: " + config.getLanguage());
        }

        byte[] zipBytes;
        try (ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
                ZipOutputStream zos = new ZipOutputStream(byteArrayOutputStream)) {

            Files.walk(baseDir)
                    .filter(Files::isRegularFile)
                    .forEach(path -> {
                        try {
                            zos.putNextEntry(new ZipEntry(baseDir.relativize(path).toString()));
                            Files.copy(path, zos);
                            zos.closeEntry();
                        } catch (IOException e) {
                            e.printStackTrace();
                        }
                    });

            zipBytes = byteArrayOutputStream.toByteArray();
        }

        deleteDirectory(tempDir.toFile());
        return zipBytes;
    }

    public String generateTestScript(String manualSteps, String htmlCode, String language, String framework) {
        StringBuilder body = new StringBuilder();
        String[] steps = manualSteps.split("\\n");

        for (String step : steps) {
            step = step.trim();
            if (step.isEmpty())
                continue;

            String lower = step.toLowerCase();

            // Handle: Enter "value" into the username field
            Matcher enterMatcher = Pattern
                    .compile("enter\\s+\"([^\"]+)\"\\s+into\\s+(?:the\\s+)?(.*?)\\s+field", Pattern.CASE_INSENSITIVE)
                    .matcher(step);
            if (enterMatcher.find()) {
                String value = enterMatcher.group(1).trim();
                String field = enterMatcher.group(2).trim();
                String locator = getBestLocator(field, htmlCode);
                body.append(
                        String.format("        driver.findElement(%s).sendKeys(\"%s\");\n", locator, escape(value)));
                continue;
            }

            // Handle: Click the Login button
            Matcher clickMatcher = Pattern.compile("click\\s+(?:the\\s+)?(.*?)\\s+button", Pattern.CASE_INSENSITIVE)
                    .matcher(step);
            if (clickMatcher.find()) {
                String field = clickMatcher.group(1).trim();
                String locator = getBestLocator(field, htmlCode);
                body.append(String.format("        driver.findElement(%s).click();\n", locator));
                continue;
            }

            // Handle: Verify that the user is navigated to the dashboard
            Matcher verifyMatcher = Pattern
                    .compile("verify.*?(?:navigated to|see|text is|contains)?\\s*\"?([^\"]+?)\"?$",
                            Pattern.CASE_INSENSITIVE)
                    .matcher(step);
            if (verifyMatcher.find()) {
                String text = verifyMatcher.group(1).trim();
                body.append(String.format("        Assert.assertTrue(driver.getPageSource().contains(\"%s\"));\n",
                        escape(text)));
                continue;
            }

            // Skip generic steps like "Open the login page"
            if (lower.contains("open") && lower.contains("login page")) {
                continue;
            }
        }

        if (body.length() == 0) {
            body.append("        // No valid steps found to automate.\n");
        }

        language = language.trim().toLowerCase();
        framework = framework.trim().toLowerCase();

        if (language.equals("java") && framework.equals("testng")) {
            return """
                    import org.openqa.selenium.By;
                    import org.openqa.selenium.WebDriver;
                    import org.openqa.selenium.chrome.ChromeDriver;
                    import org.testng.Assert;
                    import org.testng.annotations.*;

                    public class GeneratedTest {

                        WebDriver driver;

                        @BeforeMethod
                        public void setup() {
                            driver = new ChromeDriver();
                            driver.get("https://your-app-url.com");
                        }

                        @Test
                        public void testSteps() {
                    """ + body + """
                        }

                        @AfterMethod
                        public void teardown() {
                            driver.quit();
                        }
                    }
                    """;
        }

        // fallback
        return String.format("""
                // Auto-generated Test Script
                // Language: %s | Framework: %s

                // Manual Steps:
                /*
                %s
                */

                // HTML Snippet:
                /*
                %s
                */

                // ❌ Script generation not yet supported for this combination.
                """, language, framework, manualSteps, htmlCode);
    }

    private String escape(String text) {
        return text.replace("\"", "\\\"");
    }

    private String getBestLocator(String field, String htmlCode) {
        field = field.trim();
        String safeField = Pattern.quote(field);
        Matcher matcher;

        // Match by ID
        matcher = Pattern.compile("id\\s*=\\s*\"([^\"]*" + safeField + "[^\"]*)\"", Pattern.CASE_INSENSITIVE)
                .matcher(htmlCode);
        if (matcher.find())
            return String.format("By.id(\"%s\")", matcher.group(1));

        // Match by name
        matcher = Pattern.compile("name\\s*=\\s*\"([^\"]*" + safeField + "[^\"]*)\"", Pattern.CASE_INSENSITIVE)
                .matcher(htmlCode);
        if (matcher.find())
            return String.format("By.name(\"%s\")", matcher.group(1));

        // Match by placeholder
        matcher = Pattern.compile("placeholder\\s*=\\s*\"([^\"]*" + safeField + "[^\"]*)\"", Pattern.CASE_INSENSITIVE)
                .matcher(htmlCode);
        if (matcher.find())
            return String.format("By.cssSelector(\"input[placeholder='%s']\")", matcher.group(1));

        // Match <button> text
        matcher = Pattern.compile("<button[^>]*>(?i)" + safeField + "</button>", Pattern.CASE_INSENSITIVE)
                .matcher(htmlCode);
        if (matcher.find())
            return String.format("By.xpath(\"//button[text()='%s']\")", field);

        // Match <label> text
        matcher = Pattern.compile("<label[^>]*>(?i)" + safeField + "</label>", Pattern.CASE_INSENSITIVE)
                .matcher(htmlCode);
        if (matcher.find())
            return String.format("By.xpath(\"//label[text()='%s']\")", field);

        // Fallback to contains(text) or name attribute
        return String.format("By.xpath(\"//*[contains(text(), '%s') or @name='%s']\")", field, field);
    }

    private void generateJavaFramework(Path baseDir, FrameworkConfigRequest config) throws IOException {
        Path mainJava = baseDir.resolve("src/main/java/com/vinsuite/utils");
        Path testPages = baseDir.resolve("src/test/java/com/vinsuite/pages");
        Path testBase = baseDir.resolve("src/test/java/com/vinsuite/base");
        Path testTests = baseDir.resolve("src/test/java/com/vinsuite/tests");
        Path resources = baseDir.resolve("src/main/resources");

        Files.createDirectories(mainJava);
        Files.createDirectories(testPages);
        Files.createDirectories(testBase);
        Files.createDirectories(testTests);
        Files.createDirectories(resources);

        Files.writeString(baseDir.resolve("pom.xml"), getPomXml(config), StandardCharsets.UTF_8);
        Files.writeString(baseDir.resolve("testng.xml"), getTestngXml(), StandardCharsets.UTF_8);
        Files.writeString(resources.resolve("logback.xml"), getLogbackXml(), StandardCharsets.UTF_8);
        Files.writeString(baseDir.resolve("README.md"), getReadme("Java + TestNG + " + config.getReportTool()),
                StandardCharsets.UTF_8);

        Files.writeString(testTests.resolve("SampleTest.java"), getSampleTest(), StandardCharsets.UTF_8);
        Files.writeString(testBase.resolve("BaseTest.java"), "// Base test class", StandardCharsets.UTF_8);
        Files.writeString(testPages.resolve("LoginPage.java"), "// Login Page", StandardCharsets.UTF_8);
        Files.writeString(mainJava.resolve("DriverFactory.java"), "// WebDriver factory logic", StandardCharsets.UTF_8);
    }

    private void generatePythonFramework(Path baseDir, FrameworkConfigRequest config) throws IOException {
        List<String> dirs = List.of("tests", "pages", "utils", "base", "config");
        for (String dir : dirs) {
            Files.createDirectories(baseDir.resolve(dir));
        }

        Files.writeString(baseDir.resolve("requirements.txt"), "pytest\nallure-pytest\nselenium",
                StandardCharsets.UTF_8);
        Files.writeString(baseDir.resolve("pytest.ini"), "[pytest]\naddopts = -v", StandardCharsets.UTF_8);
        Files.writeString(baseDir.resolve("README.md"), getReadme("Python + PyTest + " + config.getReportTool()),
                StandardCharsets.UTF_8);
        Files.writeString(baseDir.resolve("tests/test_sample.py"),
                "def test_example():\n    print('✅ Running sample test')", StandardCharsets.UTF_8);
        Files.writeString(baseDir.resolve("pages/login_page.py"), "# Login page object", StandardCharsets.UTF_8);
        Files.writeString(baseDir.resolve("utils/driver_factory.py"), "# Selenium WebDriver factory",
                StandardCharsets.UTF_8);
        Files.writeString(baseDir.resolve("base/base_test.py"), "# Common setup/teardown", StandardCharsets.UTF_8);
        Files.writeString(baseDir.resolve("config/config.yaml"), "browser: chrome\nurl: https://example.com",
                StandardCharsets.UTF_8);
    }

    private void generateCsharpFramework(Path baseDir, FrameworkConfigRequest config) throws IOException {
        List<String> dirs = List.of("Tests", "Pages", "Utils", "Base", "Config");
        for (String dir : dirs) {
            Files.createDirectories(baseDir.resolve(dir));
        }

        Files.writeString(baseDir.resolve("VinSuiteFramework.sln"), "", StandardCharsets.UTF_8);
        Files.writeString(baseDir.resolve("VinSuiteFramework.csproj"),
                "<Project Sdk=\"Microsoft.NET.Sdk\">\n</Project>", StandardCharsets.UTF_8);
        Files.writeString(baseDir.resolve("README.md"), getReadme("C# + NUnit + " + config.getReportTool()),
                StandardCharsets.UTF_8);
        Files.writeString(baseDir.resolve("Tests/SampleTest.cs"),
                "using NUnit.Framework;\n[TestFixture]\npublic class SampleTest {\n  [Test] public void Example() => Assert.Pass();\n}",
                StandardCharsets.UTF_8);
        Files.writeString(baseDir.resolve("Pages/LoginPage.cs"), "// Login Page Object", StandardCharsets.UTF_8);
        Files.writeString(baseDir.resolve("Utils/DriverFactory.cs"), "// WebDriver Factory", StandardCharsets.UTF_8);
        Files.writeString(baseDir.resolve("Base/BaseTest.cs"), "// Base Test Class", StandardCharsets.UTF_8);
        Files.writeString(baseDir.resolve("Config/config.json"),
                "{ \"browser\": \"chrome\", \"url\": \"https://example.com\" }", StandardCharsets.UTF_8);
    }

    private String getPomXml(FrameworkConfigRequest config) {
        String reporter = switch (config.getReportTool().toLowerCase()) {
            case "allure" -> """
                    <dependency>
                        <groupId>io.qameta.allure</groupId>
                        <artifactId>allure-testng</artifactId>
                        <version>2.20.1</version>
                    </dependency>""";
            case "logback" -> """
                    <dependency>
                        <groupId>ch.qos.logback</groupId>
                        <artifactId>logback-classic</artifactId>
                        <version>1.4.11</version>
                    </dependency>""";
            default -> "";
        };

        return String.format(
                """
                        <project xmlns=\"http://maven.apache.org/POM/4.0.0\"
                                 xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"
                                 xsi:schemaLocation=\"http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd\">
                            <modelVersion>4.0.0</modelVersion>
                            <groupId>com.vinsuite</groupId>
                            <artifactId>sample-framework</artifactId>
                            <version>1.0-SNAPSHOT</version>
                            <dependencies>
                                <dependency>
                                    <groupId>org.testng</groupId>
                                    <artifactId>testng</artifactId>
                                    <version>7.9.0</version>
                                    <scope>test</scope>
                                </dependency>
                                %s
                            </dependencies>
                        </project>
                        """,
                reporter);
    }

    private String getTestngXml() {
        return """
                    <!DOCTYPE suite SYSTEM "https://testng.org/testng-1.0.dtd">
                    <suite name=\"VinSuiteSuite\">
                        <test name=\"VinSuiteTests\">
                            <classes>
                                <class name=\"SampleTest\"/>
                            </classes>
                        </test>
                    </suite>
                """;
    }

    private String getLogbackXml() {
        return """
                    <configuration>
                        <appender name=\"STDOUT\" class=\"ch.qos.logback.core.ConsoleAppender\">
                            <encoder>
                                <pattern>%d{yyyy-MM-dd HH:mm:ss} %-5level %logger{36} - %msg%n</pattern>
                            </encoder>
                        </appender>
                        <root level=\"debug\">
                            <appender-ref ref=\"STDOUT\" />
                        </root>
                    </configuration>
                """;
    }

    private String getReadme(String title) {
        return "# VinSuite Framework\n\n" +
                "**Setup:**\n\n" +
                "```sh\n<your setup instructions here>\n```\n\n" +
                "**Stack:** " + title + "\n\n" +
                "> Generated by VinSuite";
    }

    private String getSampleTest() {
        return """
                    import org.testng.annotations.Test;

                    public class SampleTest {
                        @Test
                        public void testExample() {
                            System.out.println("✅ Running test in VinSuite sample framework.");
                        }
                    }
                """;
    }

    private void deleteDirectory(File dir) {
        File[] contents = dir.listFiles();
        if (contents != null) {
            for (File file : contents) {
                deleteDirectory(file);
            }
        }
        dir.delete();
    }
}
