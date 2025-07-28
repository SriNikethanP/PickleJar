package com.pickle_company.pickle.mapper;

import com.pickle_company.pickle.dto.ProductResponseDTO;
import com.pickle_company.pickle.dto.WishlistDTO;
import com.pickle_company.pickle.entity.Wishlist;
import org.springframework.stereotype.Component;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class WishlistMapper {
    
    public WishlistDTO toDto(Wishlist wishlist) {
        if (wishlist == null) {
            return null;
        }
        
        return WishlistDTO.builder()
                .wishlistId(wishlist.getId())
                .products(wishlist.getProducts() != null ? 
                    wishlist.getProducts().stream()
                        .map(product -> ProductResponseDTO.builder()
                            .id(product.getId())
                            .name(product.getName())
                            .description(product.getDescription())
                            .price(product.getPrice())
                            .imageUrls(product.getImageUrls())
                            .stock(product.getStock())
                            .build())
                        .collect(Collectors.toList()) : null)
                .build();
    }
    
    public List<WishlistDTO> toDtoList(List<Wishlist> wishlists) {
        if (wishlists == null) {
            return null;
        }
        
        return wishlists.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }
}

