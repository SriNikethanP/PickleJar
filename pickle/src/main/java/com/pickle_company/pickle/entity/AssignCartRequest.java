package com.pickle_company.pickle.entity;



import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AssignCartRequest {
    private Long cartId;
    private Long customerId;
} 