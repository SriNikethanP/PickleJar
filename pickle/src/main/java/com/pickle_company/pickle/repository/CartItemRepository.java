package com.pickle_company.pickle.repository;

import com.pickle_company.pickle.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
}
