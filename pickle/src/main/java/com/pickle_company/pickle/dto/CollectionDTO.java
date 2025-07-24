package com.pickle_company.pickle.dto;

import lombok.*;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CollectionDTO {
    private Long id;
    private String title;
    private String handle;
    private List<ProductResponseDTO> products;
} 