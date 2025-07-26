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
    
    public CategoryDTO getById(Long id) {
        return categoryRepository.findById(id)
                .map(categoryMapper::toDto)
                .orElse(null);
    }
    
    public CategoryDTO createCategory(CategoryDTO categoryDTO) {
        Category category = Category.builder()
                .name(categoryDTO.getName())
                .build();
        Category saved = categoryRepository.save(category);
        return categoryMapper.toDto(saved);
    }
    
    public CategoryDTO updateCategory(Long id, CategoryDTO categoryDTO) {
        return categoryRepository.findById(id)
                .map(existingCategory -> {
                    existingCategory.setName(categoryDTO.getName());
                    Category updated = categoryRepository.save(existingCategory);
                    return categoryMapper.toDto(updated);
                })
                .orElse(null);
    }
    
    public boolean deleteCategory(Long id) {
        if (categoryRepository.existsById(id)) {
            categoryRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
