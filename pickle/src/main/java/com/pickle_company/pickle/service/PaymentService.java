package com.pickle_company.pickle.service;

import com.pickle_company.pickle.dto.PaymentDTO;
import com.pickle_company.pickle.entity.Payment;
import com.pickle_company.pickle.mapper.PaymentMapper;
import com.pickle_company.pickle.repository.PaymentRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class PaymentService {
    private final PaymentRepository paymentRepository;
    private final PaymentMapper paymentMapper;

    public PaymentService(PaymentRepository paymentRepository, PaymentMapper paymentMapper) {
        this.paymentRepository = paymentRepository;
        this.paymentMapper = paymentMapper;
    }

    public List<PaymentDTO> getAllPayments() {
        return paymentMapper.toDtoList(paymentRepository.findAll());
    }

    public PaymentDTO getByOrderId(Long orderId) {
        return paymentRepository.findByOrderId(orderId)
                .map(paymentMapper::toDto)
                .orElse(null);
    }

    public PaymentDTO getById(Long id) {
        return paymentRepository.findById(id)
                .map(paymentMapper::toDto)
                .orElse(null);
    }
} 