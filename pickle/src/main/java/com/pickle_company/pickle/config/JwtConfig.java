package com.pickle_company.pickle.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Data
@Component
@ConfigurationProperties(prefix = "jwt")
public class JwtConfig {
    private String secret = "your-secret-key-here-make-it-very-long-and-secure-for-production";
    private long expiration = 86400000; // 24 hours in milliseconds
    private String issuer = "pickle-company";
    private String audience = "pickle-users";
} 