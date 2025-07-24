package com.pickle_company.pickle.mapper;

import com.pickle_company.pickle.dto.CategoryDTO;
import com.pickle_company.pickle.entity.Category;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import java.util.List;

@Mapper(componentModel = "spring", uses = ProductMapper.class)
public interface CategoryMapper {
    @Mapping(target = "products", source = "products")
    CategoryDTO toDto(Category category);
    List<CategoryDTO> toDtoList(List<Category> categories);
} 