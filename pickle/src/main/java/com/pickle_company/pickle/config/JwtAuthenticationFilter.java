package com.pickle_company.pickle.config;

import com.pickle_company.pickle.entity.Role;
import com.pickle_company.pickle.entity.User;
import com.pickle_company.pickle.repository.UserRepository;
import com.pickle_company.pickle.util.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        
        String requestURI = request.getRequestURI();
        System.out.println("JWT Filter - Request URI: " + requestURI);
        
        try {
            String token = extractTokenFromRequest(request);
            System.out.println("JWT Filter - Token extracted: " + (token != null ? "Yes" : "No"));
            
            if (StringUtils.hasText(token) && jwtUtil.validateToken(token)) {
                String email = jwtUtil.extractEmail(token);
                Long userId = jwtUtil.extractUserId(token);
                Role role = jwtUtil.extractRole(token);
                
                System.out.println("JWT Filter - Token valid. Email: " + email + ", UserId: " + userId + ", Role: " + role);
                
                // Verify user still exists and is not banned
                User user = userRepository.findById(userId)
                        .orElse(null);
                
                if (user != null && !user.isBanned()) {
                    UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                            user,
                            null,
                            Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + role.name()))
                    );
                    
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                    System.out.println("JWT Filter - Authentication set for user: " + email);
                    log.debug("JWT authentication successful for user: {}", email);
                } else {
                    System.out.println("JWT Filter - User not found or banned: " + userId);
                    log.warn("User not found or banned: {}", userId);
                }
            } else {
                System.out.println("JWT Filter - Token invalid or missing");
            }
        } catch (Exception e) {
            System.out.println("JWT Filter - Error: " + e.getMessage());
            log.error("JWT authentication error: {}", e.getMessage());
        }
        
        filterChain.doFilter(request, response);
    }

    private String extractTokenFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
} 