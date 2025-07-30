package com.pickle_company.pickle.service;

import com.pickle_company.pickle.dto.PaymentDTO;
import com.pickle_company.pickle.entity.Order;
import com.pickle_company.pickle.entity.Payment;
import com.pickle_company.pickle.repository.OrderRepository;
import com.pickle_company.pickle.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PaymentService {
    
    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;
    
    public List<PaymentDTO> getAllPayments() {
        List<Payment> payments = paymentRepository.findAllWithOrderAndUser();
        return payments.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public List<PaymentDTO> getPaymentsByStatus(Payment.PaymentStatus status) {
        List<Payment> payments = paymentRepository.findByStatusWithOrderAndUser(status);
        return payments.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public PaymentDTO getPaymentById(Long id) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Payment not found"));
        return convertToDTO(payment);
    }
    
    public PaymentDTO createPaymentForOrder(Long orderId, Payment.PaymentMethod paymentMethod) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found"));
        
        // Check if payment already exists for this order
        Optional<Payment> existingPayment = paymentRepository.findByOrderIdAndStatus(orderId, Payment.PaymentStatus.PENDING);
        if (existingPayment.isPresent()) {
            throw new IllegalArgumentException("Payment already exists for this order");
        }
        
        Payment payment = Payment.builder()
                .order(order)
                .amount(order.getTotalAmount())
                .paymentMethod(paymentMethod)
                .status(Payment.PaymentStatus.PENDING)
                .transactionId(generateTransactionId(orderId))
                .build();
        
        Payment savedPayment = paymentRepository.save(payment);
        return convertToDTO(savedPayment);
    }
    
    public PaymentDTO updatePaymentStatus(Long paymentId, Payment.PaymentStatus status) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new IllegalArgumentException("Payment not found"));
        
        payment.setStatus(status);
        if (status == Payment.PaymentStatus.COMPLETED) {
            payment.setPaymentDate(LocalDateTime.now());
        }
        
        Payment updatedPayment = paymentRepository.save(payment);
        return convertToDTO(updatedPayment);
    }
    
    public void deletePayment(Long id) {
        if (!paymentRepository.existsById(id)) {
            throw new IllegalArgumentException("Payment not found");
        }
        paymentRepository.deleteById(id);
    }
    
    public long getPendingPaymentsCount() {
        return paymentRepository.countByStatus(Payment.PaymentStatus.PENDING);
    }
    
    public long getCompletedPaymentsCount() {
        return paymentRepository.countByStatus(Payment.PaymentStatus.COMPLETED);
    }
    
    public BigDecimal getTotalRevenue() {
        List<Payment> completedPayments = paymentRepository.findByStatusWithOrderAndUser(Payment.PaymentStatus.COMPLETED);
        return completedPayments.stream()
                .map(Payment::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
    
    public List<PaymentDTO> getPaymentsByOrderId(Long orderId) {
        return paymentRepository.findByOrderId(orderId)
            .stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }
    
    private PaymentDTO convertToDTO(Payment payment) {
        return PaymentDTO.builder()
                .id(payment.getId())
                .orderId(payment.getOrder().getId())
                .amount(payment.getAmount())
                .paymentMethod(payment.getPaymentMethod().name())
                .paymentMethodDisplay(payment.getPaymentMethod().getDisplayName())
                .status(payment.getStatus().name())
                .statusDisplay(payment.getStatus().getDisplayName())
                .transactionId(payment.getTransactionId())
                .paymentDate(payment.getPaymentDate())
                .createdAt(payment.getCreatedAt())
                .updatedAt(payment.getUpdatedAt())
                .orderNumber("ORD-" + payment.getOrder().getId())
                .customerName(payment.getOrder().getUser().getFullName())
                .customerEmail(payment.getOrder().getUser().getEmail())
                .build();
    }
    
    private String generateTransactionId(Long orderId) {
        return "TXN-" + System.currentTimeMillis() + "-" + orderId;
    }
} 