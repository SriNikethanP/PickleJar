package com.pickle_company.pickle.controller.v1;

import com.pickle_company.pickle.dto.OrderDTO;
import com.pickle_company.pickle.entity.Order;
import com.pickle_company.pickle.entity.User;
import com.pickle_company.pickle.service.OrderService;
import com.pickle_company.pickle.service.UserService;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/orders")
public class AdminOrderController {
    private final OrderService orderService;
    private final UserService userService;

    public AdminOrderController(OrderService orderService, UserService userService) {
        this.orderService = orderService;
        this.userService = userService;
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

    @PostMapping("/test")
    public OrderDTO createTestOrder() {
        // Create a test order for demonstration
        var customerUser = userService.getAllUsers().stream()
                .filter(u -> u.getRole().equals("CUSTOMER"))
                .findFirst()
                .orElse(null);

        if (customerUser == null) {
            throw new RuntimeException("No customer user found for test order");
        }

        // For now, we'll create a simple test order without a user entity
        // In a real scenario, you'd get the actual User entity from the repository
        Order testOrder = Order.builder()
                .totalAmount(new BigDecimal("1500.00"))
                .placedAt(LocalDateTime.now())
                .paymentMethod("COD")
                .shippingAddress("Test Address, Test City, Test State 12345")
                .customerName(customerUser.getFullName())
                .customerEmail(customerUser.getEmail())
                .customerPhone(customerUser.getMobile())
                .status("PENDING")
                .build();

        return orderService.createOrder(testOrder);
    }
} 