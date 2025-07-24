package com.pickle_company.pickle.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentDTO {
    private Long id;
    private Long orderId;
    private double amount;
    private String status;
    private String method;
    private LocalDateTime paidAt;
} 