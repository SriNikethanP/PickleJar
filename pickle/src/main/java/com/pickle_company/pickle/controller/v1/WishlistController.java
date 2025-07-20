package com.pickle_company.pickle.controller.v1;

import com.pickle_company.pickle.dto.WishlistDTO;
import com.pickle_company.pickle.service.WishlistService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/wishlist")
public class WishlistController {
    private final WishlistService wishlistService;

    public WishlistController(WishlistService wishlistService) {
        this.wishlistService = wishlistService;
    }

    // Add to wishlist
    @PostMapping("/add")
    public ResponseEntity<WishlistDTO> addToWishlist(@RequestParam Long userId, @RequestParam Long productId) {
        return ResponseEntity.ok(wishlistService.addToWishlist(userId, productId));
    }

    // Remove from wishlist
    @DeleteMapping("/remove")
    public ResponseEntity<WishlistDTO> removeFromWishlist(@RequestParam Long userId, @RequestParam Long productId) {
        return ResponseEntity.ok(wishlistService.removeFromWishlist(userId, productId));
    }

    // Get wishlist for user
    @GetMapping
    public ResponseEntity<WishlistDTO> getWishlist(@RequestParam Long userId) {
        return ResponseEntity.ok(wishlistService.getWishlist(userId));
    }
}
