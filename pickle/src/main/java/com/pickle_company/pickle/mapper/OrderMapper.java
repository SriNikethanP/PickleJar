package com.pickle_company.pickle.mapper;

import com.pickle_company.pickle.dto.OrderItemDTO;
import com.pickle_company.pickle.dto.OrderResponseDTO;
import com.pickle_company.pickle.entity.Order;
import com.pickle_company.pickle.entity.OrderItem;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface OrderMapper {
    @Mapping(source = "user.id", target = "userId")
    @Mapping(source = "user.fullName", target = "userName")
    OrderResponseDTO toOrderDto(Order entity);
    List<OrderResponseDTO> toOrderDtoList(List<Order> entities);

    @Mapping(source = "product.id", target = "productId")
    @Mapping(source = "product.name", target = "productName")
    OrderItemDTO toOrderItemDto(OrderItem entity);
    List<OrderItemDTO> toOrderItemDtoList(List<OrderItem> items);
}

