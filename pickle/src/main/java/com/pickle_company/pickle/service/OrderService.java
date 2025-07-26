package com.pickle_company.pickle.service;

import com.pickle_company.pickle.dto.OrderDTO;
import com.pickle_company.pickle.mapper.OrderMapper;
import com.pickle_company.pickle.repository.OrderRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class OrderService {
    private final OrderRepository orderRepository;
    private final OrderMapper orderMapper;

    public OrderService(OrderRepository orderRepository, OrderMapper orderMapper) {
        this.orderRepository = orderRepository;
        this.orderMapper = orderMapper;
    }

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
} 