package com.pickle_company.pickle.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.ComponentScan;

@Configuration
@ComponentScan(basePackages = {
    "com.pickle_company.pickle.mapper",
    "com.pickle_company.pickle.controller",
    "com.pickle_company.pickle.service",
    "com.pickle_company.pickle.repository"
})
public class MapStructConfig {
    // This configuration ensures that all MapStruct-generated beans are properly scanned
} 