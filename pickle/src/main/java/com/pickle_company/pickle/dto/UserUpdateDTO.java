package com.pickle_company.pickle.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserUpdateDTO {
    private String fullName;
    private String mobile;
} 