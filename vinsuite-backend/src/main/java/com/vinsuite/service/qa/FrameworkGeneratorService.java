package com.vinsuite.service.qa;

import org.springframework.stereotype.Service;

import com.vinsuite.dto.qa.FrameworkConfigRequest;

import java.io.*;
import java.nio.file.*;
import java.util.List;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

@Service
public class FrameworkGeneratorService {

    public byte[] generateFramework(FrameworkConfigRequest config) throws IOException {
        System.out.println("🟡 TEST: This is the latest build at " + System.currentTimeMillis());
        Path tempDir = Files.createTempDirectory("sample-framework");
        Path baseDir = tempDir.resolve("VinSuiteFramework");

        // Create base structure
        Files.createDirectories(baseDir);

        if ("java".equalsIgnoreCase(config.getLanguage())) {
            generateJavaFramework(baseDir, config);
        } else if ("python".equalsIgnoreCase(config.getLanguage())) {
            generatePythonFramework(baseDir, config);
        } else if ("csharp".equalsIgnoreCase(config.getLanguage()) || "c#".equalsIgnoreCase(config.getLanguage())) {
            generateCsharpFramework(baseDir, config);
        }

        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        try (ZipOutputStream zos = new ZipOutputStream(byteArrayOutputStream)) {
            Files.walk(baseDir).filter(Files::isRegularFile).forEach(filePath -> {
                try {
                    String zipEntryPath = baseDir.relativize(filePath).toString();
                    zos.putNextEntry(new ZipEntry(zipEntryPath));
                    Files.copy(filePath, zos);
                    zos.closeEntry();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            });
        }

        deleteDirectory(tempDir.toFile());
        System.out.println("✅ Framework generated successfully. ZIP size: " + byteArrayOutputStream.size() + " bytes");

        return byteArrayOutputStream.toByteArray();
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

        Files.writeString(baseDir.resolve("pom.xml"), getPomXml(config));
        Files.writeString(baseDir.resolve("testng.xml"), getTestngXml());
        Files.writeString(resources.resolve("logback.xml"), getLogbackXml());
        Files.writeString(baseDir.resolve("README.md"), getReadme("Java + TestNG + " + config.getReportTool()));

        Files.writeString(testTests.resolve("SampleTest.java"), getSampleTest());
        Files.writeString(testBase.resolve("BaseTest.java"), "// Base test class");
        Files.writeString(testPages.resolve("LoginPage.java"), "// Login Page");
        Files.writeString(mainJava.resolve("DriverFactory.java"), "// WebDriver factory logic");
    }

    private void generatePythonFramework(Path baseDir, FrameworkConfigRequest config) throws IOException {
        List<String> dirs = List.of("tests", "pages", "utils", "base", "config");
        for (String dir : dirs) {
            Files.createDirectories(baseDir.resolve(dir));
        }

        Files.writeString(baseDir.resolve("requirements.txt"), "pytest\nallure-pytest\nselenium");
        Files.writeString(baseDir.resolve("pytest.ini"), "[pytest]\naddopts = -v");
        Files.writeString(baseDir.resolve("README.md"), getReadme("Python + PyTest + " + config.getReportTool()));
        Files.writeString(baseDir.resolve("tests/test_sample.py"),
                "def test_example():\n    print('✅ Running sample test')");
        Files.writeString(baseDir.resolve("pages/login_page.py"), "# Login page object");
        Files.writeString(baseDir.resolve("utils/driver_factory.py"), "# Selenium WebDriver factory");
        Files.writeString(baseDir.resolve("base/base_test.py"), "# Common setup/teardown");
        Files.writeString(baseDir.resolve("config/config.yaml"), "browser: chrome\nurl: https://example.com");
    }

    private void generateCsharpFramework(Path baseDir, FrameworkConfigRequest config) throws IOException {
        List<String> dirs = List.of("Tests", "Pages", "Utils", "Base", "Config");
        for (String dir : dirs) {
            Files.createDirectories(baseDir.resolve(dir));
        }

        Files.writeString(baseDir.resolve("VinSuiteFramework.sln"), "");
        Files.writeString(baseDir.resolve("VinSuiteFramework.csproj"),
                "<Project Sdk=\"Microsoft.NET.Sdk\">\n</Project>");
        Files.writeString(baseDir.resolve("README.md"), getReadme("C# + NUnit + " + config.getReportTool()));
        Files.writeString(baseDir.resolve("Tests/SampleTest.cs"),
                "using NUnit.Framework;\n[TestFixture]\npublic class SampleTest {\n  [Test] public void Example() => Assert.Pass();\n}");
        Files.writeString(baseDir.resolve("Pages/LoginPage.cs"), "// Login Page Object");
        Files.writeString(baseDir.resolve("Utils/DriverFactory.cs"), "// WebDriver Factory");
        Files.writeString(baseDir.resolve("Base/BaseTest.cs"), "// Base Test Class");
        Files.writeString(baseDir.resolve("Config/config.json"),
                "{ \"browser\": \"chrome\", \"url\": \"https://example.com\" }");
    }

    private String getPomXml(FrameworkConfigRequest config) {
        String reporter = switch (config.getReportTool().toLowerCase()) {
            case "allure" ->
                "<dependency>\n<groupId>io.qameta.allure</groupId>\n<artifactId>allure-testng</artifactId>\n<version>2.20.1</version>\n</dependency>";
            case "logback" ->
                "<dependency>\n<groupId>ch.qos.logback</groupId>\n<artifactId>logback-classic</artifactId>\n<version>1.4.11</version>\n</dependency>";
            default -> "";
        };

        return String.format(
                """
                            <project xmlns="http://maven.apache.org/POM/4.0.0"
                                     xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                                     xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
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

    private String getGradleBuild(FrameworkConfigRequest config) {
        String reporter = switch (config.getReportTool().toLowerCase()) {
            case "allure" -> "implementation 'io.qameta.allure:allure-testng:2.20.1'";
            case "logback" -> "implementation 'ch.qos.logback:logback-classic:1.4.11'";
            default -> "";
        };

        return String.format("""
                    plugins {
                        id 'java'
                    }

                    group 'com.vinsuite'
                    version '1.0-SNAPSHOT'

                    repositories {
                        mavenCentral()
                    }

                    dependencies {
                        %s
                    }
                """, reporter);
    }

    private String getTestngXml() {
        return """
                    <!DOCTYPE suite SYSTEM "https://testng.org/testng-1.0.dtd">
                    <suite name="VinSuiteSuite">
                        <test name="VinSuiteTests">
                            <classes>
                                <class name="SampleTest"/>
                            </classes>
                        </test>
                    </suite>
                """;
    }

    private String getLogbackXml() {
        return """
                    <configuration>
                        <appender name="STDOUT" class="ch.qos.logback.core.ConsoleAppender">
                            <encoder>
                                <pattern>%d{yyyy-MM-dd HH:mm:ss} %-5level %logger{36} - %msg%n</pattern>
                            </encoder>
                        </appender>
                        <root level="debug">
                            <appender-ref ref="STDOUT" />
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

    private void deleteDirectory(File directoryToBeDeleted) {
        File[] allContents = directoryToBeDeleted.listFiles();
        if (allContents != null) {
            for (File file : allContents) {
                deleteDirectory(file);
            }
        }
        directoryToBeDeleted.delete();
    }
}
