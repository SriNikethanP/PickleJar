package com.pickle_company.pickle.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CategoryDTO {
    private Long id;
    private String name;
    // Temporarily comment out products to avoid circular dependency issues
    // private List<ProductResponseDTO> products;
}
