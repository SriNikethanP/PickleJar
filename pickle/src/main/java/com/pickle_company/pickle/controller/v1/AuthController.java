package com.pickle_company.pickle.controller.v1;

import com.pickle_company.pickle.dto.AuthResponseDTO;
import com.pickle_company.pickle.dto.LoginRequestDTO;
import com.pickle_company.pickle.dto.RefreshTokenRequestDTO;
import com.pickle_company.pickle.dto.UserRegistrationDTO;
import com.pickle_company.pickle.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {
    private final UserService userService;

    public AuthController(UserService userService){
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponseDTO> registerUser(@RequestBody UserRegistrationDTO userRegistrationDTO){
        AuthResponseDTO authResponse = userService.registerUser(userRegistrationDTO);
        return ResponseEntity.ok(authResponse);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> loginUser(@RequestBody LoginRequestDTO loginRequestDTO){
        AuthResponseDTO authResponse = userService.loginUser(loginRequestDTO);
        return ResponseEntity.ok(authResponse);
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponseDTO> refreshToken(@RequestBody RefreshTokenRequestDTO refreshTokenRequest){
        AuthResponseDTO authResponse = userService.refreshToken(refreshTokenRequest);
        return ResponseEntity.ok(authResponse);
    }
}
