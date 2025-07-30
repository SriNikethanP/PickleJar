package com.pickle_company.pickle.service;

import com.pickle_company.pickle.dto.OrderDTO;
import com.pickle_company.pickle.entity.Order;
import com.pickle_company.pickle.entity.Payment;
import com.pickle_company.pickle.mapper.OrderMapper;
import com.pickle_company.pickle.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {
    private final OrderRepository orderRepository;
    private final OrderMapper orderMapper;
    private final PaymentService paymentService;

    public List<OrderDTO> getAllOrders() {
        return orderMapper.toOrderDtoList(orderRepository.findAll());
    }

    public List<OrderDTO> getOrdersByUser(Long userId) {
        return orderMapper.toOrderDtoList(orderRepository.findByUserId(userId));
    }

    public OrderDTO getOrderById(Long id) {
        return orderRepository.findById(id)
                .map(orderMapper::toOrderDto)
                .orElse(null);
    }

    @Transactional
    public OrderDTO createOrder(Order order) {
        // Set default status if not provided
        if (order.getStatus() == null) {
            order.setStatus("PENDING");
        }
        
        // Save the order
        Order savedOrder = orderRepository.save(order);
        
        // Create payment for the order (default to COD)
        Payment.PaymentMethod paymentMethod = Payment.PaymentMethod.COD;
        if (order.getPaymentMethod() != null) {
            try {
                paymentMethod = Payment.PaymentMethod.valueOf(order.getPaymentMethod().toUpperCase());
            } catch (IllegalArgumentException e) {
                // Default to COD if payment method is invalid
                paymentMethod = Payment.PaymentMethod.COD;
            }
        }
        
        // Create payment record
        paymentService.createPaymentForOrder(savedOrder.getId(), paymentMethod);
        
        return orderMapper.toOrderDto(savedOrder);
    }
} 