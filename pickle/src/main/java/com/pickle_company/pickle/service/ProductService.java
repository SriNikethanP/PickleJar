package com.pickle_company.pickle.service;

import com.pickle_company.pickle.dto.*;
import com.pickle_company.pickle.entity.Category;
import com.pickle_company.pickle.entity.Collection;
import com.pickle_company.pickle.entity.Product;
import com.pickle_company.pickle.entity.Review;
import com.pickle_company.pickle.mapper.ProductMapper;
import com.pickle_company.pickle.mapper.ReviewMapper;
import com.pickle_company.pickle.repository.CategoryRepository;
import com.pickle_company.pickle.repository.CollectionRepository;
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
    private final CollectionRepository collectionRepo;
    private final ProductMapper productMapper;
    private final ReviewRepository reviewRepo;
    private final ReviewMapper reviewMapper;

    public ProductService(ProductRepository productRepo, CategoryRepository categoryRepo,
                          CollectionRepository collectionRepo, ProductMapper productMapper, 
                          ReviewRepository reviewRepo, ReviewMapper reviewMapper) {
        this.productRepo = productRepo;
        this.categoryRepo = categoryRepo;
        this.collectionRepo = collectionRepo;
        this.productMapper = productMapper;
        this.reviewRepo = reviewRepo;
        this.reviewMapper = reviewMapper;
        }

    // Create/Update Product
    public ProductResponseDTO addOrUpdateProduct(ProductRequestDTO dto, Long productId) {
        Category category = null;
        if (dto.getCategoryId() != null) {
            category = categoryRepo.findById(dto.getCategoryId())
                    .orElseThrow(() -> new IllegalArgumentException("Category with ID " + dto.getCategoryId() + " not found"));
        } else if (dto.getCategoryName() != null) {
            category = categoryRepo.findByName(dto.getCategoryName())
                    .orElseGet(() -> categoryRepo.save(Category.builder().name(dto.getCategoryName()).build()));
        }
        // If neither categoryId nor categoryName is provided, category remains null (which is allowed)

        Collection collection = null;
        if (dto.getCollectionId() != null) {
            collection = collectionRepo.findById(dto.getCollectionId())
                    .orElseThrow(() -> new IllegalArgumentException("Collection with ID " + dto.getCollectionId() + " not found"));
        }
        // If collectionId is not provided, collection remains null (which is allowed)

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
        product.setCollection(collection);
        
        // Handle image URLs from Cloudinary
        if (dto.getImageUrls() != null && !dto.getImageUrls().isEmpty()) {
            System.out.println("Received imageUrls from frontend: " + dto.getImageUrls());
            if (productId != null) {
                // For updates, merge with existing images
                List<String> existingImages = new ArrayList<>(product.getImageUrls());
                existingImages.addAll(dto.getImageUrls());
                product.setImageUrls(existingImages);
                System.out.println("Updated product imageUrls: " + product.getImageUrls());
            } else {
                // For new products, set the image URLs
                product.setImageUrls(dto.getImageUrls());
                System.out.println("Set new product imageUrls: " + product.getImageUrls());
            }
        } else if (productId != null) {
            // For updates with no new images, keep existing images
            System.out.println("No new images provided, keeping existing images: " + product.getImageUrls());
        } else {
            System.out.println("No imageUrls received from frontend for new product");
        }

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

        // Validate rating
        if (reviewDTO.getRating() < 1 || reviewDTO.getRating() > 5) {
            throw new IllegalArgumentException("Rating must be between 1 and 5");
        }

        // Validate comment length
        if (reviewDTO.getComment() != null && reviewDTO.getComment().length() > 1000) {
            throw new IllegalArgumentException("Comment must be less than 1000 characters");
        }

        Review review = Review.builder()
                .product(product)
                .username(reviewDTO.getUsername()) // in real-world, extract from JWT/Principal
                .rating(reviewDTO.getRating())
                .comment(reviewDTO.getComment())
                .createdAt(LocalDateTime.now())
                .verified(false) // Set to true if user has purchased the product
                .build();

        return reviewMapper.toDto(reviewRepo.save(review));
    }

    // Get reviews for a product
    public List<ReviewDTO> getProductReviews(Long productId) {
        Product product = productRepo.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));
        
        return product.getReviews().stream()
                .map(reviewMapper::toDto)
                .toList();
    }

    // Get average rating for a product
    public double getAverageRating(Long productId) {
        Product product = productRepo.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));
        
        if (product.getReviews().isEmpty()) {
            return 0.0;
        }
        
        double totalRating = product.getReviews().stream()
                .mapToInt(Review::getRating)
                .sum();
        
        return Math.round((totalRating / product.getReviews().size()) * 10.0) / 10.0;
    }

    public void deleteProduct(Long productId) {
        Product product = productRepo.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));
        product.setActive(false);
        productRepo.save(product);
    }

    // Delete a specific product image
    public ProductResponseDTO deleteProductImage(Long productId, String imageUrl) {
        Product product = productRepo.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));
        
        List<String> currentImages = new ArrayList<>(product.getImageUrls());
        boolean removed = currentImages.remove(imageUrl);
        
        if (!removed) {
            throw new IllegalArgumentException("Image not found in product");
        }
        
        product.setImageUrls(currentImages);
        Product savedProduct = productRepo.save(product);
        return productMapper.toDto(savedProduct);
    }

    public List<ProductResponseDTO> getAllProducts() {
        return productRepo.findAll()
                .stream()
                .map(productMapper::toDto)
                .collect(Collectors.toList());
    }

    public List<ProductResponseDTO> getActiveProducts() {
        return productRepo.findByActiveTrue()
                .stream()
                .map(productMapper::toDto)
                .collect(Collectors.toList());
    }

    public List<ProductResponseDTO> getProductsByCollectionId(Long collectionId) {
        return productRepo.findByCollection_Id(collectionId)
                .stream()
                .map(productMapper::toDto)
                .collect(Collectors.toList());
    }
}
