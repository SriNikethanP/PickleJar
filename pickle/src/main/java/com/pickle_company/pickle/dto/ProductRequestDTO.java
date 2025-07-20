package com.pickle_company.pickle.dto;

import lombok.*;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductRequestDTO {
    private String name;
    private String description;
    private List<String> imageUrls; // Use only if uploading via URLs; else, handled by file upload
    private double price;
    private int stock;
    private boolean active;
    private String categoryName;
}


