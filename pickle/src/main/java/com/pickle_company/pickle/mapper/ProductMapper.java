package com.pickle_company.pickle.mapper;

import com.pickle_company.pickle.dto.ProductResponseDTO;
import com.pickle_company.pickle.entity.Product;
import org.springframework.stereotype.Component;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class ProductMapper {
    
    public ProductResponseDTO toDto(Product product) {
        if (product == null) {
            return null;
        }
        
        double averageRating = 0.0;
        if (product.getReviews() != null && !product.getReviews().isEmpty()) {
            averageRating = product.getReviews().stream()
                    .mapToInt(r -> r.getRating())
                    .average()
                    .orElse(0.0);
        }
        
        return ProductResponseDTO.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .imageUrls(product.getImageUrls())
                .price(product.getPrice())
                .stock(product.getStock())
                .categoryName(product.getCategory() != null ? product.getCategory().getName() : null)
                .averageRating(averageRating)
                .build();
    }
    
    public List<ProductResponseDTO> toDto(List<Product> products) {
        if (products == null) {
            return null;
        }
        
        return products.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }
}
