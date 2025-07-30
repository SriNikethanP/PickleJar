 package com.pickle_company.pickle.repository;

import com.pickle_company.pickle.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    
    List<Payment> findByOrderId(Long orderId);
    
    Optional<Payment> findByOrderIdAndStatus(Long orderId, Payment.PaymentStatus status);
    
    @Query("SELECT p FROM Payment p JOIN FETCH p.order o JOIN FETCH o.user u ORDER BY p.createdAt DESC")
    List<Payment> findAllWithOrderAndUser();
    
    @Query("SELECT p FROM Payment p JOIN FETCH p.order o JOIN FETCH o.user u WHERE p.status = :status ORDER BY p.createdAt DESC")
    List<Payment> findByStatusWithOrderAndUser(Payment.PaymentStatus status);
    
    @Query("SELECT COUNT(p) FROM Payment p WHERE p.status = :status")
    long countByStatus(Payment.PaymentStatus status);

    @Query("SELECT DATE(p.paymentDate), SUM(p.amount) FROM Payment p WHERE p.status = 'COMPLETED' AND p.paymentDate >= :startDate GROUP BY DATE(p.paymentDate) ORDER BY DATE(p.paymentDate)")
    List<Object[]> findDailyRevenueSince(@Param("startDate") LocalDate startDate);
}
