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
        
        List<CartItemDTO> items = toCartItemDtoList(cart.getItems());
        double subtotal = calculateSubtotal(items);
        double shippingCharges = calculateShippingCharges(subtotal);
        double gstTax = calculateGSTTax(subtotal);
        double total = subtotal + shippingCharges + gstTax;
        
        return CartResponseDTO.builder()
                .cartId(cart.getId())
                .items(items)
                .subtotal(subtotal)
                .shippingCharges(shippingCharges)
                .gstTax(gstTax)
                .total(total)
                .build();
    }
    
    private double calculateSubtotal(List<CartItemDTO> items) {
        if (items == null) return 0.0;
        return items.stream()
                .mapToDouble(item -> item.getPrice() * item.getQuantity())
                .sum();
    }
    
    private double calculateShippingCharges(double subtotal) {
        // Free shipping for orders above ₹500, otherwise ₹50
        return subtotal >= 500 ? 0.0 : 50.0;
    }
    
    private double calculateGSTTax(double subtotal) {
        // 18% GST on subtotal
        return subtotal * 0.18;
    }

    public CartItemDTO toCartItemDto(CartItem item) {
        if (item == null) {
            return null;
        }
        
        return CartItemDTO.builder()
                .cartItemId(item.getId())
                .productId(item.getProduct().getId())
                .productName(item.getProduct().getName())
                .productDescription(item.getProduct().getDescription())
                .price(item.getProduct().getPrice())
                .quantity(item.getQuantity())
                .imageUrls(item.getProduct().getImageUrls().toArray(new String[0]))
                .stock(item.getProduct().getStock())
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

