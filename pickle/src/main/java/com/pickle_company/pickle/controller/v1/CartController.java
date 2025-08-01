package com.pickle_company.pickle.controller.v1;

import com.pickle_company.pickle.dto.AddToCartRequestDTO;
import com.pickle_company.pickle.dto.CartResponseDTO;
import com.pickle_company.pickle.dto.CheckoutResponseDTO;
import com.pickle_company.pickle.dto.UpdateCartItemRequestDTO;
import com.pickle_company.pickle.dto.CODOrderRequestDTO;
import com.pickle_company.pickle.dto.AssignCartRequestDTO;
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
    
    @DeleteMapping
    public ResponseEntity<Void> clearCart() {
        Long userId = SecurityUtil.getCurrentUserId();
        if (userId == null) {
            return ResponseEntity.status(401).build();
        }
        try {
            cartService.clearCart(userId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
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

    // COD Checkout
    @PostMapping("/checkout/cod")
    public ResponseEntity<CheckoutResponseDTO> codCheckout(@RequestBody CODOrderRequestDTO request) {
        System.out.println("COD Checkout endpoint called");
        System.out.println("Request body: " + request);
        
        Long userId = SecurityUtil.getCurrentUserId();
        System.out.println("Current user ID: " + userId);
        
        if (userId == null) {
            System.out.println("User ID is null - authentication failed");
            return ResponseEntity.status(401).body(null);
        }
        
        try {
            System.out.println("Calling cartService.codCheckout with userId: " + userId);
            CheckoutResponseDTO checkoutDTO = cartService.codCheckout(userId, request);
            System.out.println("COD checkout successful: " + checkoutDTO);
            return ResponseEntity.ok(checkoutDTO);
        } catch (IllegalArgumentException e) {
            System.out.println("IllegalArgumentException: " + e.getMessage());
            return ResponseEntity.badRequest().body(null);
        } catch (Exception e) {
            System.out.println("Exception in COD checkout: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(null);
        }
    }

    @PutMapping("/assign")
    public ResponseEntity<CartResponseDTO> assignCartToUser(@RequestBody AssignCartRequestDTO request) {
        CartResponseDTO cartDTO = cartService.assignCartToUser(request.getCartId(), request.getCustomerId());
        return ResponseEntity.ok(cartDTO);
    }
}

