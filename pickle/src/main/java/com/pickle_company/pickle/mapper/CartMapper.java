package com.pickle_company.pickle.mapper;

import com.pickle_company.pickle.dto.CartResponseDTO;
import com.pickle_company.pickle.dto.CartItemDTO;
import com.pickle_company.pickle.entity.Cart;
import com.pickle_company.pickle.entity.CartItem;
import org.springframework.stereotype.Component;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class CartMapper {

    public CartResponseDTO toDto(Cart cart) {
        if (cart == null) {
            return null;
        }
        
        return CartResponseDTO.builder()
                .cartId(cart.getId())
                .items(toCartItemDtoList(cart.getItems()))
                .build();
    }

    public CartItemDTO toCartItemDto(CartItem item) {
        if (item == null) {
            return null;
        }
        
        return CartItemDTO.builder()
                .cartItemId(item.getId())
                .productId(item.getProduct().getId())
                .productName(item.getProduct().getName())
                .price(item.getProduct().getPrice())
                .quantity(item.getQuantity())
                .build();
    }

    public List<CartItemDTO> toCartItemDtoList(List<CartItem> items) {
        if (items == null) {
            return null;
        }
        
        return items.stream()
                .map(this::toCartItemDto)
                .collect(Collectors.toList());
    }
}

