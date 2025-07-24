package com.pickle_company.pickle.mapper;

import com.pickle_company.pickle.dto.OrderDTO;
import com.pickle_company.pickle.dto.OrderItemDTO;
import com.pickle_company.pickle.entity.Order;
import com.pickle_company.pickle.entity.OrderItem;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import java.util.List;

@Mapper(componentModel = "spring", uses = {UserMapper.class, ProductMapper.class})
public interface OrderMapper {
    @Mapping(target = "user", source = "user")
    @Mapping(target = "items", source = "items")
    OrderDTO toOrderDto(Order order);
    List<OrderDTO> toOrderDtoList(List<Order> orders);

    @Mapping(target = "product", source = "product")
    OrderItemDTO toOrderItemDto(OrderItem item);
    List<OrderItemDTO> toOrderItemDtoList(List<OrderItem> items);
}

