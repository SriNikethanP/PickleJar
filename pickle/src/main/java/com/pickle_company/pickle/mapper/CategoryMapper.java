package com.pickle_company.pickle.mapper;

import com.pickle_company.pickle.dto.CategoryDTO;
import com.pickle_company.pickle.entity.Category;
import com.pickle_company.pickle.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class CategoryMapper {
    
    @Autowired
    private ProductRepository productRepository;
    
    public CategoryDTO toDto(Category category) {
        if (category == null) {
            return null;
        }
        
        // Get product count for this category
        long productCount = productRepository.countByCategoryId(category.getId());
        
        return CategoryDTO.builder()
                .id(category.getId())
                .name(category.getName())
                .productCount(productCount)
                .build();
    }
    
    public List<CategoryDTO> toDtoList(List<Category> categories) {
        if (categories == null) {
            return null;
        }
        
        return categories.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }
} 