package com.pickle_company.pickle.mapper;

import com.pickle_company.pickle.dto.*;
import com.pickle_company.pickle.entity.*;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ProductMapper {
    Product toEntity(ProductRequestDTO dto);

    // List mapping
    List<ProductResponseDTO> toDto(List<Product> entities);

    List<ReviewDTO> reviewsToDtos(List<Review> reviews);
    ReviewDTO reviewToDto(Review review);

        @Mapping(source = "category.name", target = "categoryName")
        @Mapping(target = "averageRating", expression = "java(calcAverage(entity.getReviews()))")
        ProductResponseDTO toDto(Product entity);

        // Default method - calculate average rating
        default double calcAverage(List<Review> reviews) {
            if (reviews == null || reviews.isEmpty()) return 0.0;
            return reviews.stream().mapToInt(Review::getRating).average().orElse(0.0);
        }

}
