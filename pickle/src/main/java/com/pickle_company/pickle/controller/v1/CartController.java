package com.pickle_company.pickle.controller.v1;

import com.pickle_company.pickle.dto.CartResponseDTO;
import com.pickle_company.pickle.dto.CheckoutResponseDTO;
import com.pickle_company.pickle.dto.UpdateCartItemRequestDTO;
import com.pickle_company.pickle.service.CartService;
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
    public ResponseEntity<CartResponseDTO> getUserCart(@RequestParam Long userId) {
        CartResponseDTO cartDTO = cartService.getCartByUserId(userId);
        return ResponseEntity.ok(cartDTO);
    }
    @PutMapping("/item")
    public ResponseEntity<CartResponseDTO> updateItem(
            @RequestParam Long userId, @RequestBody UpdateCartItemRequestDTO dto) {
        return ResponseEntity.ok(cartService.updateItem(userId, dto));
    }
    @DeleteMapping("/item")
    public ResponseEntity<CartResponseDTO> removeItem(
            @RequestParam Long userId, @RequestParam Long cartItemId) {
        return ResponseEntity.ok(cartService.removeItem(userId, cartItemId));
    }
    // Checkout
    @PostMapping("/checkout")
    public ResponseEntity<CheckoutResponseDTO> checkout(@RequestParam Long userId) {
        return ResponseEntity.ok(cartService.checkout(userId));
    }
}

