package com.pickle_company.pickle.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartItemDTO {
    private Long cartItemId;
    private Long productId;     
    private String productName;
    private String productDescription;
    private double price;
    private int quantity;
    private String[] imageUrls;
    private int stock;
}
