package com.pickle_company.pickle.dto;

import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CheckoutResponseDTO {
    private Long orderId;
    private double totalAmount;
    private LocalDateTime placedAt;
}
