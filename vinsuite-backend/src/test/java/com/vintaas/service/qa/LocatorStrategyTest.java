package com.vintaas.service.qa;

import org.junit.jupiter.api.Test;

import com.vinsuite.service.qa.LocatorStrategy;

import static org.junit.jupiter.api.Assertions.*;

public class LocatorStrategyTest {

    @Test
    public void testToPythonTuple() {
        assertEquals("(By.ID, \"username\")", LocatorStrategy.toPythonTuple("@FindBy(id = \"username\")"));
        assertEquals("(By.NAME, \"password\")", LocatorStrategy.toPythonTuple("@FindBy(name = \"password\")"));
        assertEquals("(By.CSS_SELECTOR, \".btn.primary\")", LocatorStrategy.toPythonTuple("@FindBy(css = \".btn.primary\")"));
        assertEquals("(By.XPATH, \"//div[@id='x']\")", LocatorStrategy.toPythonTuple("@FindBy(xpath = \"//div[@id='x']\")"));
    }

    @Test
    public void testToCSharpFindsBy() {
        assertEquals("[FindsBy(ID = \"username\")]", LocatorStrategy.toCSharpFindsBy("@FindBy(id = \"username\")"));
        assertEquals("[FindsBy(NAME = \"password\")]", LocatorStrategy.toCSharpFindsBy("@FindBy(name = \"password\")"));
        assertEquals("[FindsBy(CSS = \".btn.primary\")]", LocatorStrategy.toCSharpFindsBy("@FindBy(css = \".btn.primary\")"));
        assertEquals("[FindsBy(XPATH = \"//div[@id='x']\")]", LocatorStrategy.toCSharpFindsBy("@FindBy(xpath = \"//div[@id='x']\")"));
    }

    @Test
    public void testFallbacks() {
        assertEquals("(By.ID, \"\")", LocatorStrategy.toPythonTuple("@FindBy(random = \"xyz\")"));
        assertEquals("[FindsBy(Id = \"\")]", LocatorStrategy.toCSharpFindsBy("@FindBy(unknown = \"123\")"));
    }
}
