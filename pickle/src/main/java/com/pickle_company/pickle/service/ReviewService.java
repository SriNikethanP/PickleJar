package com.pickle_company.pickle.service;

import com.pickle_company.pickle.dto.ReviewDTO;
import com.pickle_company.pickle.entity.Product;
import com.pickle_company.pickle.entity.Review;
import com.pickle_company.pickle.mapper.ReviewMapper;
import com.pickle_company.pickle.repository.ProductRepository;
import com.pickle_company.pickle.repository.ReviewRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReviewService {
    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final ReviewMapper reviewMapper;

    public ReviewService(ReviewRepository reviewRepository, ProductRepository productRepository, ReviewMapper reviewMapper) {
        this.reviewRepository = reviewRepository;
        this.productRepository = productRepository;
        this.reviewMapper = reviewMapper;
    }

    public ReviewDTO addReview(Long productId, String username, int rating) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));
        Review review = Review.builder()
                .product(product)
                .username(username)
                .rating(rating)
                .createdAt(LocalDateTime.now())
                .build();
        return reviewMapper.toDto(reviewRepository.save(review));
    }

    public List<ReviewDTO> getReviewsForProduct(Long productId) {
        return reviewMapper.toDtoList(reviewRepository.findByProductId(productId));
    }
} 