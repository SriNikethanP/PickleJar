package com.pickle_company.pickle.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Data
@Component
@ConfigurationProperties(prefix = "jwt")
public class JwtConfig {
    private String secret = "asldkfjoi23u829h2hfe9r8whewgiohers";
    private long expiration = 86400000; // 24 hours in milliseconds
    private String issuer = "pickle-company";
    private String audience = "pickle-users";
} 