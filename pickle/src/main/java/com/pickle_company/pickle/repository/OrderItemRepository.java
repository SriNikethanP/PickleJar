package com.pickle_company.pickle.repository;

import com.pickle_company.pickle.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.domain.Pageable;
import java.util.List;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    @Query("SELECT p, COUNT(oi) as salesCount FROM OrderItem oi JOIN oi.product p GROUP BY p.id ORDER BY salesCount DESC")
    List<Object[]> findPopularProducts(Pageable pageable);
}
