package com.vinsuite;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;

@SpringBootApplication(exclude = { SecurityAutoConfiguration.class })
public class VinsuiteApplication {
	public static void main(String[] args) {
		SpringApplication.run(VinsuiteApplication.class, args);
	}
}
