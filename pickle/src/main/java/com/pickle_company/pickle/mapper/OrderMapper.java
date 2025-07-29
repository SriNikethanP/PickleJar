package com.pickle_company.pickle.mapper;

import com.pickle_company.pickle.dto.OrderDTO;
import com.pickle_company.pickle.dto.OrderItemDTO;
import com.pickle_company.pickle.entity.Order;
import com.pickle_company.pickle.entity.OrderItem;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class OrderMapper {
    
    @Autowired
    private UserMapper userMapper;
    
    @Autowired
    private ProductMapper productMapper;
    
    public OrderDTO toOrderDto(Order order) {
        if (order == null) {
            return null;
        }
        
        return OrderDTO.builder()
                .id(order.getId())
                .user(userMapper.toDto(order.getUser()))
                .items(toOrderItemDtoList(order.getItems()))
                .totalAmount(order.getTotalAmount())
                .placedAt(order.getPlacedAt())
                .status("PLACED") // Default status since it's not in the entity
                .paymentMethod(order.getPaymentMethod())
                .shippingAddress(order.getShippingAddress())
                .customerName(order.getCustomerName())
                .customerEmail(order.getCustomerEmail())
                .customerPhone(order.getCustomerPhone())
                .build();
    }
    
    public List<OrderDTO> toOrderDtoList(List<Order> orders) {
        if (orders == null) {
            return null;
        }
        
        return orders.stream()
                .map(this::toOrderDto)
                .collect(Collectors.toList());
    }

    public OrderItemDTO toOrderItemDto(OrderItem item) {
        if (item == null) {
            return null;
        }
        
        return OrderItemDTO.builder()
                .id(item.getId())
                .product(productMapper.toDto(item.getProduct()))
                .quantity(item.getQuantity())
                .priceAtOrder(item.getPriceAtOrder())
                .build();
    }
    
    public List<OrderItemDTO> toOrderItemDtoList(List<OrderItem> items) {
        if (items == null) {
            return null;
        }
        
        return items.stream()
                .map(this::toOrderItemDto)
                .collect(Collectors.toList());
    }
}

