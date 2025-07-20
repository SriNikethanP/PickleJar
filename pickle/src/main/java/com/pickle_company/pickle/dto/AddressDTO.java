package com.pickle_company.pickle.dto;


import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AddressDTO {
    private String street;
    private String city;
    private String state;
    private String pincode;
}
