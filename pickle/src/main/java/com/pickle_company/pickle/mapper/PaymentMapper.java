package com.pickle_company.pickle.mapper;

import com.pickle_company.pickle.dto.PaymentDTO;
import com.pickle_company.pickle.entity.Payment;
import org.springframework.stereotype.Component;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class PaymentMapper {
    
    public PaymentDTO toDto(Payment payment) {
        if (payment == null) {
            return null;
        }
        
        return PaymentDTO.builder()
                .id(payment.getId())
                .orderId(payment.getOrder() != null ? payment.getOrder().getId() : null)
                .amount(payment.getAmount())
                .method(payment.getMethod())
                .status(payment.getStatus())
                .build();
    }
    
    public List<PaymentDTO> toDtoList(List<Payment> payments) {
        if (payments == null) {
            return null;
        }
        
        return payments.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }
} 