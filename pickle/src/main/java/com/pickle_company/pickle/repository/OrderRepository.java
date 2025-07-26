package com.pickle_company.pickle.repository;

import com.pickle_company.pickle.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserId(Long userId);

    @Query("SELECT SUM(o.totalAmount) FROM Order o")
    Double findTotalSales();

    // New: Aggregate revenue by year and month
    @Query("SELECT FUNCTION('YEAR', o.placedAt) as year, FUNCTION('MONTH', o.placedAt) as month, SUM(o.totalAmount) as revenue FROM Order o GROUP BY year, month ORDER BY year, month")
    List<Object[]> findMonthlyRevenue();
}
