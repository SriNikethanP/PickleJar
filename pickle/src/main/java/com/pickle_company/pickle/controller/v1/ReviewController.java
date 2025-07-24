package com.pickle_company.pickle.controller.v1;

import com.pickle_company.pickle.dto.ReviewDTO;
import com.pickle_company.pickle.service.ReviewService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/reviews")
public class ReviewController {
    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @PostMapping
    public ResponseEntity<ReviewDTO> addReview(@RequestParam Long productId, @RequestParam String username, @RequestParam int rating) {
        return ResponseEntity.ok(reviewService.addReview(productId, username, rating));
    }

    @GetMapping
    public List<ReviewDTO> getReviewsForProduct(@RequestParam Long productId) {
        return reviewService.getReviewsForProduct(productId);
    }
} 