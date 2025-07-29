package com.pickle_company.pickle.dto;

import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderDTO {
    private Long id;
    private UserResponseDTO user;
    private List<OrderItemDTO> items;
    private double totalAmount;
    private LocalDateTime placedAt;
    private String status;
    private String paymentMethod;
    private String shippingAddress;
    private String customerName;
    private String customerEmail;
    private String customerPhone;
} 