package com.pickle_company.pickle.controller.v1;

import com.pickle_company.pickle.dto.LoginRequestDTO;
import com.pickle_company.pickle.dto.UserRegistrationDTO;
import com.pickle_company.pickle.dto.UserResponseDTO;
import com.pickle_company.pickle.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {
    private final UserService userService;

    public AuthController(UserService userService){
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<UserResponseDTO> registerUser(@RequestBody UserRegistrationDTO userRegistrationDTO){
        UserResponseDTO userResponseDTO =  userService.registerUser(userRegistrationDTO);
        return ResponseEntity.ok(userResponseDTO);
    }

    @PostMapping("/login")
    public ResponseEntity<UserResponseDTO> loginUser(@RequestBody LoginRequestDTO loginRequestDTO){
        UserResponseDTO userResponseDTO =  userService.loginUser(loginRequestDTO);
        return ResponseEntity.ok(userResponseDTO);
    }
}
