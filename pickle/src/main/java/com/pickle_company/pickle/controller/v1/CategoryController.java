 package com.pickle_company.pickle.controller.v1;

import com.pickle_company.pickle.dto.CategoryDTO;
import com.pickle_company.pickle.service.CategoryService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/categories")
public class CategoryController {
    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping
    public List<CategoryDTO> getAllCategories(@RequestParam(value = "name", required = false) String name) {
        if (name != null) {
            CategoryDTO category = categoryService.getByName(name);
            return category != null ? List.of(category) : List.of();
        }
        return categoryService.getAllCategories();
    }
}
