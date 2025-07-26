package com.pickle_company.pickle.mapper;

import com.pickle_company.pickle.dto.CategoryDTO;
import com.pickle_company.pickle.entity.Category;
import org.springframework.stereotype.Component;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class CategoryMapper {
    
    public CategoryDTO toDto(Category category) {
        if (category == null) {
            return null;
        }
        
        return CategoryDTO.builder()
                .id(category.getId())
                .name(category.getName())
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