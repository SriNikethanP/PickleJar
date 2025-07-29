package com.pickle_company.pickle.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AssignCartRequestDTO {
    private Long cartId;
    private Long customerId;
} 