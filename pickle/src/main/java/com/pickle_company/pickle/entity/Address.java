package com.pickle_company.pickle.entity;

import jakarta.persistence.Embeddable;
import lombok.*;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Address {
    private String street;
    private String city;
    private String state;
    private String pincode;
}
