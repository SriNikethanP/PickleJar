package com.pickle_company.pickle.service;

import com.pickle_company.pickle.dto.*;
import com.pickle_company.pickle.entity.Category;
import com.pickle_company.pickle.entity.Product;
import com.pickle_company.pickle.entity.Review;
import com.pickle_company.pickle.mapper.ProductMapper;
import com.pickle_company.pickle.mapper.ReviewMapper;
import com.pickle_company.pickle.repository.CategoryRepository;
import com.pickle_company.pickle.repository.ProductRepository;
import com.pickle_company.pickle.repository.ReviewRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductService {
    private final ProductRepository productRepo;
    private final CategoryRepository categoryRepo;
    private final ProductMapper productMapper;
    private final ReviewRepository reviewRepo;
    private final ReviewMapper reviewMapper;

    public ProductService(ProductRepository productRepo, CategoryRepository categoryRepo,
                          ProductMapper productMapper, ReviewRepository reviewRepo, ReviewMapper reviewMapper) {
        this.productRepo = productRepo;
        this.categoryRepo = categoryRepo;
        this.productMapper = productMapper;
        this.reviewRepo = reviewRepo;
        this.reviewMapper = reviewMapper;
        }

    // Create/Update Product
    public ProductResponseDTO addOrUpdateProduct(ProductRequestDTO dto, Long productId) {
        Category category = categoryRepo.findByName(dto.getCategoryName())
                .orElseGet(() -> categoryRepo.save(Category.builder().name(dto.getCategoryName()).build()));

        Product product;
        if (productId != null) {
            product = productRepo.findById(productId).orElseThrow();
        } else {
            product = new Product();
        }
        product.setName(dto.getName());
        product.setDescription(dto.getDescription());
        product.setPrice(dto.getPrice());
        product.setStock(dto.getStock());
        product.setActive(dto.isActive());
        product.setCategory(category);
        // For images: handled via file upload, so don't set imageUrls here.

        Product saved = productRepo.save(product);
        return productMapper.toDto(saved);
    }

    // Get product details by ID (with reviews)
    public ProductResponseDTO getProductDetails(Long id) {
        Product product = productRepo.findById(id).orElseThrow();
        // Reviews loaded by JPA, mapped in DTO
        return productMapper.toDto(product);
    }

    // Product search/filter
    public List<ProductResponseDTO> searchProducts(String name, String category, boolean inStock) {
        List<Product> products;
        if (name != null && category != null) {
            products = productRepo.findByCategory_NameAndNameContainingIgnoreCase(category, name);
        } else if (name != null) {
            products = productRepo.findByNameContainingIgnoreCase(name);
        } else if (category != null) {
            products = productRepo.findByCategory_Name(category);
        } else if (inStock) {
            products = productRepo.findByStockGreaterThan(0);
        } else {
            products = productRepo.findAll();
        }
        return productMapper.toDto(products);
    }

    // Update stock (admin)
    public ProductResponseDTO updateStock(Long productId, int newStock) {
        Product product = productRepo.findById(productId).orElseThrow();
        product.setStock(newStock);
        product.setActive(newStock > 0);
        return productMapper.toDto(productRepo.save(product));
    }

    // Mark out-of-stock (admin)
    public ProductResponseDTO markOutOfStock(Long productId) {
        Product product = productRepo.findById(productId).orElseThrow();
        product.setStock(0);
        product.setActive(false);
        return productMapper.toDto(productRepo.save(product));
    }

    // Image upload (see controller for file handling)
    public ProductResponseDTO addImage(Long productId, String imageUrl) {
        Product product = productRepo.findById(productId).orElseThrow();
        List<String> imageUrls = new ArrayList<>(product.getImageUrls());
        imageUrls.add(imageUrl);
        product.setImageUrls(imageUrls);
        return productMapper.toDto(productRepo.save(product));
    }

    // Add review
    public ReviewDTO addReview(Long productId, ReviewDTO reviewDTO) {
        Product product = productRepo.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));

        Review review = Review.builder()
                .product(product)
                .username(reviewDTO.getUsername()) // in real-world, extract from JWT/Principal
                .rating(reviewDTO.getRating())
                .createdAt(LocalDateTime.now())
                .build();

        return reviewMapper.toDto(reviewRepo.save(review));
    }

    public void deleteProduct(Long productId) {
        productRepo.deleteById(productId);
    }

    public List<ProductResponseDTO> getAllProducts() {
        return productRepo.findAll()
                .stream()
                .map(productMapper::toDto)
                .collect(Collectors.toList());
    }
}
