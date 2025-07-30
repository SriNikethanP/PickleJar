package com.pickle_company.pickle.dto;

import com.pickle_company.pickle.entity.Payment;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentDTO {
    private Long id;
    private Long orderId;
    private BigDecimal amount;
    private String paymentMethod;
    private String paymentMethodDisplay;
    private String status;
    private String statusDisplay;
    private String transactionId;
    private LocalDateTime paymentDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Order details for admin view
    private String orderNumber;
    private String customerName;
    private String customerEmail;
} 