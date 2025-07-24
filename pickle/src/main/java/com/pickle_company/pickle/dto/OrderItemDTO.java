package com.pickle_company.pickle.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItemDTO {
    private Long id;
    private ProductResponseDTO product;
    private int quantity;
    private double priceAtOrder;
}
