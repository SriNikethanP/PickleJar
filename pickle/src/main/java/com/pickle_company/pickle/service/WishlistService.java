package com.pickle_company.pickle.service;

import com.pickle_company.pickle.dto.WishlistDTO;
import com.pickle_company.pickle.entity.Product;
import com.pickle_company.pickle.entity.User;
import com.pickle_company.pickle.entity.Wishlist;
import com.pickle_company.pickle.mapper.WishlistMapper;
import com.pickle_company.pickle.repository.ProductRepository;
import com.pickle_company.pickle.repository.UserRepository;
import com.pickle_company.pickle.repository.WishlistRepository;
import org.springframework.stereotype.Service;

import java.util.HashSet;

@Service
public class WishlistService {
    private final WishlistRepository wishlistRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final WishlistMapper wishlistMapper;

    public WishlistService(WishlistRepository wishlistRepository,
                           UserRepository userRepository,
                           ProductRepository productRepository,
                           WishlistMapper wishlistMapper) {
        this.wishlistRepository = wishlistRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.wishlistMapper = wishlistMapper;
    }

    public WishlistDTO addToWishlist(Long userId, Long productId) {
        Wishlist wishlist = wishlistRepository.findByUserId(userId)
                .orElseGet(() -> {
                    User user = userRepository.findById(userId)
                            .orElseThrow(() -> new IllegalArgumentException("User not found"));
                    return wishlistRepository.save(Wishlist.builder().user(user).build());
                });

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));

        wishlist.getProducts().add(product);
        Wishlist saved = wishlistRepository.save(wishlist);
        return wishlistMapper.toDto(saved);
    }

    public WishlistDTO removeFromWishlist(Long userId, Long productId) {
        Wishlist wishlist = wishlistRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Wishlist not found"));
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));

        wishlist.getProducts().remove(product);
        wishlistRepository.save(wishlist);
        return wishlistMapper.toDto(wishlist);
    }

    public WishlistDTO getWishlist(Long userId) {
        Wishlist wishlist = wishlistRepository.findByUserId(userId)
                .orElseGet(() -> Wishlist.builder().products(new HashSet<>()).build());
        return wishlistMapper.toDto(wishlist);
    }
}
