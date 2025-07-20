package com.pickle_company.pickle.dto;

import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderResponseDTO {
    private Long id;
    private Long userId;
    private String userName; // Optional, useful for admin view
    private List<OrderItemDTO> items;
    private double totalAmount;
    private LocalDateTime placedAt;
}
