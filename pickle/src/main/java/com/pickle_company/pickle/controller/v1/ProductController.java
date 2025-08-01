package com.pickle_company.pickle.controller.v1;

import com.pickle_company.pickle.dto.*;
import com.pickle_company.pickle.service.ProductService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/products")
public class ProductController {
    private final ProductService productService;

    public ProductController(ProductService productService) { this.productService = productService; }

    @GetMapping
    public ResponseEntity<List<ProductResponseDTO>> getAllProducts() {
        return ResponseEntity.ok(productService.getActiveProducts());
    }
    // Product details page
    @GetMapping("/{id}")
    public ResponseEntity<ProductResponseDTO> getProduct(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductDetails(id));
    }

    // Search/filter products
    @GetMapping("/search")
    public ResponseEntity<List<ProductResponseDTO>> search(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String category,
            @RequestParam(required = false, defaultValue = "false") boolean inStock) {
        return ResponseEntity.ok(productService.searchProducts(name, category, inStock));
    }

    // Admin: Get all products (including inactive)
    @GetMapping("/admin")
    public ResponseEntity<List<ProductResponseDTO>> getAllProductsForAdmin() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

    // Admin: Add or update product
    @PostMapping("/admin")
    public ResponseEntity<ProductResponseDTO> addProduct(@RequestBody ProductRequestDTO dto) {
        return ResponseEntity.ok(productService.addOrUpdateProduct(dto, null));
    }

    @PutMapping("/admin/{id}")
    public ResponseEntity<ProductResponseDTO> updateProduct(
            @PathVariable Long id, @RequestBody ProductRequestDTO dto) {
        return ResponseEntity.ok(productService.addOrUpdateProduct(dto, id));
    }

    // Stock management
    @PutMapping("/admin/{id}/stock")
    public ResponseEntity<ProductResponseDTO> updateStock(
            @PathVariable Long id, @RequestParam int stock) {
        return ResponseEntity.ok(productService.updateStock(id, stock));
    }

    @PutMapping("/admin/{id}/out-of-stock")
    public ResponseEntity<ProductResponseDTO> markOutOfStock(@PathVariable Long id) {
        return ResponseEntity.ok(productService.markOutOfStock(id));
    }

    // Image upload
    @PostMapping(value = "/admin/{id}/images", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ProductResponseDTO> uploadImage(
            @PathVariable Long id, @RequestParam("image") MultipartFile file) throws IOException {
        String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path uploadsDir = Paths.get("uploads");
        Files.createDirectories(uploadsDir);
        Path filePath = uploadsDir.resolve(filename);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
        String imageUrl = "/uploads/" + filename;
        return ResponseEntity.ok(productService.addImage(id, imageUrl));
    }

    // Add review
    @PostMapping("/{id}/reviews")
    public ResponseEntity<ReviewDTO> addReview(@PathVariable Long id, @RequestBody ReviewDTO dto) {
        return ResponseEntity.ok(productService.addReview(id, dto));
    }

    // Get reviews for a product
    @GetMapping("/{id}/reviews")
    public ResponseEntity<List<ReviewDTO>> getProductReviews(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductReviews(id));
    }

    // Get average rating for a product
    @GetMapping("/{id}/rating")
    public ResponseEntity<Double> getAverageRating(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getAverageRating(id));
    }
    @DeleteMapping("/admin/{id}")
    public ResponseEntity<ProductResponseDTO> deleteProduct(@PathVariable Long id) {
        try {
        productService.deleteProduct(id);
            return ResponseEntity.ok(productService.getProductDetails(id));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                .body(null);
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(null);
        }
    }

    // Delete a specific product image
    @DeleteMapping("/admin/{id}/images")
    public ResponseEntity<ProductResponseDTO> deleteProductImage(
            @PathVariable Long id, @RequestBody DeleteImageRequest request) {
        return ResponseEntity.ok(productService.deleteProductImage(id, request.getImageUrl()));
    }

}

