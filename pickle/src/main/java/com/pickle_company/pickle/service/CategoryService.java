 package com.pickle_company.pickle.service;

import com.pickle_company.pickle.dto.CategoryDTO;
import com.pickle_company.pickle.entity.Category;
import com.pickle_company.pickle.mapper.CategoryMapper;
import com.pickle_company.pickle.repository.CategoryRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CategoryService {
    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;

    public CategoryService(CategoryRepository categoryRepository, CategoryMapper categoryMapper) {
        this.categoryRepository = categoryRepository;
        this.categoryMapper = categoryMapper;
    }

    public List<CategoryDTO> getAllCategories() {
        return categoryMapper.toDtoList(categoryRepository.findAll());
    }

    public CategoryDTO getByName(String name) {
        return categoryRepository.findByName(name)
                .map(categoryMapper::toDto)
                .orElse(null);
    }
}
