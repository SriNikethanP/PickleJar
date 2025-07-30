package com.pickle_company.pickle.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DatabaseConfig {

    @Value("${spring.datasource.url:}")
    private String datasourceUrl;

    @Value("${spring.datasource.username:}")
    private String datasourceUsername;

    @Value("${spring.datasource.password:}")
    private String datasourcePassword;

    @Bean
    public CommandLineRunner validateDatabaseConfig() {
        return args -> {
            if (datasourceUrl == null || datasourceUrl.trim().isEmpty()) {
                throw new IllegalStateException(
                    "SPRING_DATASOURCE_URL environment variable is required but not set. " +
                    "Please set SPRING_DATASOURCE_URL in your deployment environment."
                );
            }
            
            if (datasourceUsername == null || datasourceUsername.trim().isEmpty()) {
                throw new IllegalStateException(
                    "SPRING_DATASOURCE_USERNAME environment variable is required but not set. " +
                    "Please set SPRING_DATASOURCE_USERNAME in your deployment environment."
                );
            }
            
            if (datasourcePassword == null || datasourcePassword.trim().isEmpty()) {
                throw new IllegalStateException(
                    "SPRING_DATASOURCE_PASSWORD environment variable is required but not set. " +
                    "Please set SPRING_DATASOURCE_PASSWORD in your deployment environment."
                );
            }
            
            System.out.println("Database configuration validated successfully.");
            System.out.println("Database URL: " + datasourceUrl);
            System.out.println("Database Username: " + datasourceUsername);
        };
    }
} 