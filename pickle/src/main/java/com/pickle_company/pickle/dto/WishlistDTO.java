package com.pickle_company.pickle.dto;

import lombok.*;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WishlistDTO {
    private Long wishlistId;
    private List<ProductResponseDTO> products;
}
