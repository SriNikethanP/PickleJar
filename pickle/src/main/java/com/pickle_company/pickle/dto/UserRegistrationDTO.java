package com.pickle_company.pickle.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserRegistrationDTO {
    private String fullName;
    private String email;
    private String mobile;
    private String password;
    private String confirmPassword;
    private AddressDTO address;
}

