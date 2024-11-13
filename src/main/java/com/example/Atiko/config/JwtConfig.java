package com.example.Atiko.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.example.Atiko.security.jwt.JwtUtils;

@Configuration
public class JwtConfig {
    @Bean
    public com.example.Atiko.security.jwt.JwtUtils jwtUtils() {
        return new JwtUtils();
    }
}
