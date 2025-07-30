package com.pickle_company.pickle.controller.v1;

import com.pickle_company.pickle.dto.PaymentDTO;
import com.pickle_company.pickle.entity.Payment;
import com.pickle_company.pickle.service.PaymentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin/payments")
public class AdminPaymentController {
    
    private final PaymentService paymentService;
    
    public AdminPaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }
    
    @GetMapping
    public ResponseEntity<List<PaymentDTO>> getAllPayments() {
        List<PaymentDTO> payments = paymentService.getAllPayments();
        return ResponseEntity.ok(payments);
    }
    
    @GetMapping("/status/{status}")
    public ResponseEntity<List<PaymentDTO>> getPaymentsByStatus(@PathVariable String status) {
        try {
            Payment.PaymentStatus paymentStatus = Payment.PaymentStatus.valueOf(status.toUpperCase());
            List<PaymentDTO> payments = paymentService.getPaymentsByStatus(paymentStatus);
            return ResponseEntity.ok(payments);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<PaymentDTO> getPaymentById(@PathVariable Long id) {
        try {
            PaymentDTO payment = paymentService.getPaymentById(id);
            return ResponseEntity.ok(payment);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PutMapping("/{id}/status")
    public ResponseEntity<PaymentDTO> updatePaymentStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {
        try {
            String statusStr = request.get("status");
            Payment.PaymentStatus status = Payment.PaymentStatus.valueOf(statusStr.toUpperCase());
            PaymentDTO updatedPayment = paymentService.updatePaymentStatus(id, status);
            return ResponseEntity.ok(updatedPayment);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePayment(@PathVariable Long id) {
        try {
            paymentService.deletePayment(id);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getPaymentStats() {
        long pendingCount = paymentService.getPendingPaymentsCount();
        long completedCount = paymentService.getCompletedPaymentsCount();
        BigDecimal totalRevenue = paymentService.getTotalRevenue();
        
        Map<String, Object> stats = Map.of(
            "pendingCount", pendingCount,
            "completedCount", completedCount,
            "totalRevenue", totalRevenue
        );
        
        return ResponseEntity.ok(stats);
    }
} 