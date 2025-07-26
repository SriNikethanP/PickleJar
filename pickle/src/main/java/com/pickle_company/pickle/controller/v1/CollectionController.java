package com.pickle_company.pickle.controller.v1;

import com.pickle_company.pickle.dto.CollectionDTO;
import com.pickle_company.pickle.service.CollectionService;
import com.pickle_company.pickle.dto.ProductResponseDTO;
import com.pickle_company.pickle.service.ProductService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/collections")
public class CollectionController {
    private final CollectionService collectionService;
    private final ProductService productService;

    public CollectionController(CollectionService collectionService, ProductService productService) {
        this.collectionService = collectionService;
        this.productService = productService;
    }

    @GetMapping
    public List<CollectionDTO> getAllCollections() {
        try {
            List<CollectionDTO> collections = collectionService.getAllCollections();
            System.out.println("Returning " + collections.size() + " collections");
            return collections;
        } catch (Exception e) {
            System.err.println("Error fetching collections: " + e.getMessage());
            e.printStackTrace();
            return java.util.Collections.emptyList();
        }
    }

    @GetMapping("/{id}/products")
    public List<ProductResponseDTO> getProductsByCollection(@PathVariable Long id) {
        return productService.getProductsByCollectionId(id);
    }
} 