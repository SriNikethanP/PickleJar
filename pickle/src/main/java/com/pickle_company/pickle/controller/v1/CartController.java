package com.pickle_company.pickle.controller.v1;

import com.pickle_company.pickle.dto.AddToCartRequestDTO;
import com.pickle_company.pickle.dto.CartResponseDTO;
import com.pickle_company.pickle.dto.CheckoutResponseDTO;
import com.pickle_company.pickle.dto.UpdateCartItemRequestDTO;
import com.pickle_company.pickle.entity.AssignCartRequest;
import com.pickle_company.pickle.service.CartService;
import com.pickle_company.pickle.util.SecurityUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/cart")
public class CartController {
    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping
    public ResponseEntity<CartResponseDTO> getUserCart() {
        Long userId = SecurityUtil.getCurrentUserId();
        if (userId == null) {
            return ResponseEntity.status(401).body(null);
        }
        try {
            CartResponseDTO cartDTO = cartService.getCartByUserId(userId);
            return ResponseEntity.ok(cartDTO);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }
    
    @PostMapping
    public ResponseEntity<CartResponseDTO> addToCart(@RequestBody AddToCartRequestDTO request) {
        Long userId = SecurityUtil.getCurrentUserId();
        if (userId == null) {
            return ResponseEntity.status(401).body(null);
        }
        try {
            CartResponseDTO cartDTO = cartService.addToCart(userId, request);
            return ResponseEntity.ok(cartDTO);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }
    
    @PutMapping("/item")
    public ResponseEntity<CartResponseDTO> updateItem(@RequestBody UpdateCartItemRequestDTO dto) {
        Long userId = SecurityUtil.getCurrentUserId();
        if (userId == null) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(cartService.updateItem(userId, dto));
    }
    
    @DeleteMapping("/item")
    public ResponseEntity<CartResponseDTO> removeItem(@RequestParam Long cartItemId) {
        Long userId = SecurityUtil.getCurrentUserId();
        if (userId == null) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(cartService.removeItem(userId, cartItemId));
    }
    
    // Checkout
    @PostMapping("/checkout")
    public ResponseEntity<CheckoutResponseDTO> checkout() {
        Long userId = SecurityUtil.getCurrentUserId();
        if (userId == null) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(cartService.checkout(userId));
    }

    @PutMapping("/assign")
    public ResponseEntity<CartResponseDTO> assignCartToUser(@RequestBody AssignCartRequest request) {
        CartResponseDTO cartDTO = cartService.assignCartToUser(request.getCartId(), request.getCustomerId());
        return ResponseEntity.ok(cartDTO);
    }
}

