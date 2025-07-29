package com.pickle_company.pickle.dto;

import lombok.*;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartResponseDTO {
    private Long cartId;
    private List<CartItemDTO> items;
    private double subtotal;
    private double shippingCharges;
    private double gstTax;
    private double total;
}

