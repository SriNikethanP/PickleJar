package com.pickle_company.pickle.dto;

import lombok.*;

import java.util.List;

@Data 
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductResponseDTO {
    private Long id;
    private String name;
    private String description;
    private List<String> imageUrls;
    private double price;
    private int stock;
    private List<ReviewDTO> reviews; // Add DTO as needed (id, user, comment, rating...)
    private String categoryName;
    private double averageRating;
}

