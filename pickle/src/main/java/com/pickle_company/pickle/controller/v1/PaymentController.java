 package com.pickle_company.pickle.controller.v1;

import com.pickle_company.pickle.dto.PaymentDTO;
import com.pickle_company.pickle.service.PaymentService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/payments")
public class PaymentController {
    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @GetMapping
    public List<PaymentDTO> getAllPayments(@RequestParam(value = "orderId", required = false) Long orderId) {
        if (orderId != null) {
            PaymentDTO payment = paymentService.getByOrderId(orderId);
            return payment != null ? List.of(payment) : List.of();
        }
        return paymentService.getAllPayments();
    }

    @GetMapping("/{id}")
    public PaymentDTO getById(@PathVariable Long id) {
        return paymentService.getById(id);
    }
}
