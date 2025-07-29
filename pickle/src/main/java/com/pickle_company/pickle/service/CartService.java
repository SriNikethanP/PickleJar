package com.pickle_company.pickle.service;

import com.pickle_company.pickle.dto.AddToCartRequestDTO;
import com.pickle_company.pickle.dto.CartResponseDTO;
import com.pickle_company.pickle.dto.CheckoutResponseDTO;
import com.pickle_company.pickle.dto.UpdateCartItemRequestDTO;
import com.pickle_company.pickle.dto.CODOrderRequestDTO;
import com.pickle_company.pickle.entity.*;
import com.pickle_company.pickle.repository.*;
import com.pickle_company.pickle.mapper.CartMapper;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;


@Service
public class CartService {
    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final CartMapper cartMapper;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final CartItemRepository cartItemRepository;

    public CartService(CartRepository cartRepo, ProductRepository prodRepo,
                       UserRepository userRepository, CartMapper cartMapper,
                       OrderRepository orderRepository,
                       OrderItemRepository orderItemRepository,
                       CartItemRepository cartItemRepository) {
        this.cartRepository = cartRepo;
        this.productRepository = prodRepo;
        this.userRepository = userRepository;
        this.cartMapper= cartMapper;
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.cartItemRepository = cartItemRepository;
    }

    public CartResponseDTO addToCart(Long userId, AddToCartRequestDTO req) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Cart cart = cartRepository.findByUserId(userId).orElseGet(() -> {
            Cart newCart = new Cart();
            newCart.setUser(user);
            return cartRepository.save(newCart);
        });

        Product product = productRepository.findById(req.getProductId())
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));

        CartItem existingItem = cart.getItems().stream()
                .filter(item -> item.getProduct().getId().equals(req.getProductId()))
                .findFirst()
                .orElse(null);

        if (existingItem != null) {
            existingItem.setQuantity(existingItem.getQuantity() + req.getQuantity());
        } else {
            CartItem newItem = new CartItem();
            newItem.setCart(cart);
            newItem.setProduct(product);
            newItem.setQuantity(req.getQuantity());
            cart.getItems().add(newItem);
        }

        Cart savedCart = cartRepository.save(cart);
        return cartMapper.toDto(savedCart);
    }


    public CartResponseDTO getCartByUserId(Long userId) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseGet(() -> {
                    // Create a new cart for the user if one doesn't exist
                    User user = userRepository.findById(userId)
                            .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));
                    Cart newCart = new Cart();
                    newCart.setUser(user);
                    return cartRepository.save(newCart);
                });
        return cartMapper.toDto(cart);
    }
    @Transactional
    public CheckoutResponseDTO checkout(Long userId) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("No cart for user"));
        if (cart.getItems().isEmpty()) throw new IllegalArgumentException("Cart is empty!");
        User user = cart.getUser();

        // Create Order
        Order order = Order.builder()
                .user(user)
                .totalAmount(cart.getItems().stream()
                        .mapToDouble(ci -> ci.getProduct().getPrice() * ci.getQuantity()).sum())
                .placedAt(LocalDateTime.now())
                .build();
        order = orderRepository.save(order);

        // Copy items as snapshot, update product stock
        for (CartItem cartItem : cart.getItems()) {
            Product product = cartItem.getProduct();
            if (product.getStock() < cartItem.getQuantity())
                throw new IllegalArgumentException("Not enough stock for " + product.getName());
            product.setStock(product.getStock() - cartItem.getQuantity());
            productRepository.save(product);
            orderItemRepository.save(OrderItem.builder()
                    .order(order)
                    .product(product)
                    .quantity(cartItem.getQuantity())
                    .priceAtOrder(product.getPrice())
                    .build());
        }
        // Clear cart
        cart.getItems().clear();
        cartRepository.save(cart);

        return CheckoutResponseDTO.builder()
                .orderId(order.getId())
                .totalAmount(order.getTotalAmount())
                .placedAt(order.getPlacedAt())
                .build();
    }

    public CartResponseDTO updateItem(Long userId, UpdateCartItemRequestDTO req) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("No cart for user"));
        CartItem item = cart.getItems().stream()
                .filter(ci -> ci.getId().equals(req.getCartItemId()))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Cart item not found"));
        if (req.getQuantity() <= 0) {
            cart.getItems().remove(item);
            cartItemRepository.delete(item);
        } else {
            item.setQuantity(req.getQuantity());
        }
        cartRepository.save(cart);
        return getCartByUserId(userId);
    }

    public CartResponseDTO removeItem(Long userId, Long cartItemId) {
        return updateItem(userId, new UpdateCartItemRequestDTO(cartItemId, 0));
    }

    public CartResponseDTO assignCartToUser(Long cartId, Long userId) {
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new IllegalArgumentException("Cart not found: " + cartId));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));
        cart.setUser(user);
        Cart savedCart = cartRepository.save(cart);
        return cartMapper.toDto(savedCart);
    }

    public void clearCart(Long userId) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("No cart for user"));
        
        // Delete all cart items
        cartItemRepository.deleteAll(cart.getItems());
        
        // Clear the cart items list
        cart.getItems().clear();
        cartRepository.save(cart);
    }

    @Transactional
    public CheckoutResponseDTO codCheckout(Long userId, CODOrderRequestDTO request) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("No cart for user"));
        if (cart.getItems().isEmpty()) throw new IllegalArgumentException("Cart is empty!");
        User user = cart.getUser();

        // Create Order with COD details
        Order order = Order.builder()
                .user(user)
                .totalAmount(cart.getItems().stream()
                        .mapToDouble(ci -> ci.getProduct().getPrice() * ci.getQuantity()).sum())
                .placedAt(LocalDateTime.now())
                .paymentMethod("COD")
                .shippingAddress(request.getAddress() + ", " + request.getCity() + ", " + request.getState() + " - " + request.getPincode())
                .customerName(request.getFullName())
                .customerEmail(request.getEmail())
                .customerPhone(request.getPhone())
                .build();
        order = orderRepository.save(order);

        // Copy items as snapshot, update product stock
        for (CartItem cartItem : cart.getItems()) {
            Product product = cartItem.getProduct();
            if (product.getStock() < cartItem.getQuantity())
                throw new IllegalArgumentException("Not enough stock for " + product.getName());
            product.setStock(product.getStock() - cartItem.getQuantity());
            productRepository.save(product);
            orderItemRepository.save(OrderItem.builder()
                    .order(order)
                    .product(product)
                    .quantity(cartItem.getQuantity())
                    .priceAtOrder(product.getPrice())
                    .build());
        }
        // Clear cart
        cart.getItems().clear();
        cartRepository.save(cart);

        return CheckoutResponseDTO.builder()
                .orderId(order.getId())
                .totalAmount(order.getTotalAmount())
                .placedAt(order.getPlacedAt())
                .paymentMethod("COD")
                .build();
    }
}

