package com.pickle_company.pickle.mapper;


import com.pickle_company.pickle.dto.CartResponseDTO;
import com.pickle_company.pickle.dto.CartItemDTO;
import com.pickle_company.pickle.entity.Cart;
import com.pickle_company.pickle.entity.CartItem;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface CartMapper {

    // Cart entity to CartResponseDTO
    @Mapping(source = "id", target = "cartId")
    @Mapping(source = "items", target = "items")
    CartResponseDTO toDto(Cart cart);

    // Individual CartItem to CartItemDTO (with nested mappings)
    @Mapping(source = "id", target = "cartItemId")
    @Mapping(source = "product.id", target = "productId")
    @Mapping(source = "product.name", target = "productName")
    @Mapping(source = "product.price", target = "price")
    CartItemDTO toCartItemDto(CartItem item);

    // List mapping (optional, for convenience)
    List<CartItemDTO> toCartItemDtoList(List<CartItem> items);
}

