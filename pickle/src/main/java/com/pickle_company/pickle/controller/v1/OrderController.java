package com.pickle_company.pickle.controller.v1;

import com.pickle_company.pickle.dto.OrderDTO;
import com.pickle_company.pickle.service.OrderService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/orders")
public class OrderController {
    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping
    public List<OrderDTO> getAllOrders(@RequestParam(value = "userId", required = false) Long userId) {
        if (userId != null) {
            return orderService.getOrdersByUser(userId);
        }
        return orderService.getAllOrders();
    }

    @GetMapping("/{id}")
    public OrderDTO getOrderById(@PathVariable Long id) {
        return orderService.getOrderById(id);
    }
} 