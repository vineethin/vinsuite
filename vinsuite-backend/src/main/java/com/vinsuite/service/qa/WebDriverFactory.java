package com.vinsuite.service.qa;

import com.vinsuite.config.TestAuraConfig;
import io.github.bonigarcia.wdm.WebDriverManager;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import java.time.Duration;

public class WebDriverFactory {

    public static WebDriver create(TestAuraConfig config) {
        WebDriverManager.chromedriver().setup();
        ChromeOptions options = new ChromeOptions();

        if (config.isChromeHeadless()) {
            options.addArguments("--headless=new");
            options.addArguments("--window-size=1920,1080");
        }

        options.addArguments("--no-sandbox", "--disable-dev-shm-usage");
        WebDriver driver = new ChromeDriver(options);

        // Increase implicit wait to 15 seconds to allow more time for element loading
        driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(15));

        // Set page load timeout to 30 seconds
        driver.manage().timeouts().pageLoadTimeout(Duration.ofSeconds(30)); 

        // Maximize window for non-headless mode
        if (!config.isChromeHeadless()) {
            driver.manage().window().maximize();
        }

        return driver;
    }
}
