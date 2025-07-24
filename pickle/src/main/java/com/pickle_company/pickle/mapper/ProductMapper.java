package com.pickle_company.pickle.mapper;

import com.pickle_company.pickle.dto.ProductResponseDTO;
import com.pickle_company.pickle.entity.Product;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import java.util.List;

@Mapper(componentModel = "spring")
public interface ProductMapper {
    @Mapping(target = "categoryName", source = "category.name")
    @Mapping(target = "averageRating", expression = "java(product.getReviews() == null || product.getReviews().isEmpty() ? 0.0 : product.getReviews().stream().mapToInt(r -> r.getRating()).average().orElse(0.0))")
    ProductResponseDTO toDto(Product product);
    List<ProductResponseDTO> toDto(List<Product> products);
}
