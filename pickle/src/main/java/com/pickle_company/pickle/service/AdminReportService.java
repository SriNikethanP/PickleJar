package com.pickle_company.pickle.service;

import com.pickle_company.pickle.dto.ProductResponseDTO;
import com.pickle_company.pickle.mapper.ProductMapper;
import com.pickle_company.pickle.repository.OrderItemRepository;
import com.pickle_company.pickle.repository.ProductRepository;
import com.pickle_company.pickle.repository.OrderRepository;
import com.pickle_company.pickle.repository.UserRepository;
import com.pickle_company.pickle.repository.PaymentRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

@Service
public class AdminReportService {
    private final OrderItemRepository orderItemRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final ProductMapper productMapper;
    private final UserRepository userRepository;
    private final PaymentRepository paymentRepository;

    public AdminReportService(OrderItemRepository orderItemRepository,
                              ProductRepository productRepository,
                              OrderRepository orderRepository,
                              ProductMapper productMapper,
                              UserRepository userRepository,
                              PaymentRepository paymentRepository) {
        this.orderItemRepository = orderItemRepository;
        this.productRepository = productRepository;
        this.orderRepository = orderRepository;
        this.productMapper = productMapper;
        this.userRepository = userRepository;
        this.paymentRepository = paymentRepository;
    }

    public List<ProductResponseDTO> getPopularProducts(int limit) {
        List<Object[]> results = orderItemRepository.findPopularProducts(PageRequest.of(0, limit));
        return results.stream()
                .map(obj -> productMapper.toDto((com.pickle_company.pickle.entity.Product)obj[0]))
                .collect(Collectors.toList());
    }

    public double getTotalSales() {
        Double total = orderRepository.findTotalSales();
        return total == null ? 0.0 : total;
    }

    public List<ProductResponseDTO> getLowStockProducts(int threshold) {
        return productMapper.toDto(productRepository.findByStockLessThanEqual(threshold));
    }

    public List<Map<String, Object>> getRevenueTrendLast30Days() {
        List<Map<String, Object>> trend = new java.util.ArrayList<>();
        LocalDate today = LocalDate.now();
        
        // Generate 30 days of data (even if no revenue)
        for (int i = 29; i >= 0; i--) {
            LocalDate date = today.minusDays(i);
            Map<String, Object> day = new HashMap<>();
            day.put("date", date.toString());
            day.put("revenue", 0.0); // Default to 0, will be updated if data exists
            trend.add(day);
        }
        
        try {
            // Get revenue per day from DB
            LocalDate startDate = today.minusDays(29);
            List<Object[]> dailyRevenue = paymentRepository.findDailyRevenueSince(startDate);

            // Update trend with actual revenue data
            for (Object[] row : dailyRevenue) {
                try {
                    LocalDate date;
                    if (row[0] instanceof java.sql.Date) {
                        date = ((java.sql.Date) row[0]).toLocalDate();
                    } else if (row[0] instanceof java.time.LocalDate) {
                        date = (java.time.LocalDate) row[0];
                    } else if (row[0] instanceof java.sql.Timestamp) {
                        date = ((java.sql.Timestamp) row[0]).toLocalDateTime().toLocalDate();
                    } else {
                        // Handle as string if needed
                        date = java.time.LocalDate.parse(row[0].toString());
                    }
                    Double revenue = row[1] != null ? ((Number) row[1]).doubleValue() : 0.0;
                    
                    // Find and update the corresponding day in trend
                    for (Map<String, Object> day : trend) {
                        if (day.get("date").equals(date.toString())) {
                            day.put("revenue", revenue);
                            break;
                        }
                    }
                } catch (Exception e) {
                    // Log error but continue processing other rows
                    System.err.println("Error processing revenue row: " + e.getMessage());
                }
            }
        } catch (Exception e) {
            // If database query fails, return trend with all zeros
            System.err.println("Error fetching revenue data: " + e.getMessage());
        }
        
        return trend;
    }

    public List<Map<String, Object>> getCategoryDistribution() {
        // Example: return [{name: 'Pickles', value: 120}, ...]
        List<Map<String, Object>> pie = new java.util.ArrayList<>();
        Map<String, Object> cat1 = new HashMap<>();
        cat1.put("name", "Pickles");
        cat1.put("value", 120);
        pie.add(cat1);
        Map<String, Object> cat2 = new HashMap<>();
        cat2.put("name", "Sauces");
        cat2.put("value", 80);
        pie.add(cat2);
        return pie;
    }

    public int getTotalOrders() {
        return (int) orderRepository.count();
    }

    public int getTotalCustomers() {
        return (int) userRepository.count();
    }

    public List<Map<String, Object>> getMonthlyRevenueTimeline() {
        // Returns [{year: 2023, month: 1, revenue: 1234.56}, ...]
        List<Map<String, Object>> timeline = new java.util.ArrayList<>();
        try {
            List<Object[]> results = orderRepository.findMonthlyRevenue();
            for (Object[] row : results) {
                Map<String, Object> entry = new HashMap<>();
                entry.put("year", row[0]);
                entry.put("month", row[1]);
                entry.put("revenue", row[2] != null ? ((Number) row[2]).doubleValue() : 0.0);
                timeline.add(entry);
            }
        } catch (Exception e) {
            // If database query fails, return empty timeline
            System.err.println("Error fetching monthly revenue timeline: " + e.getMessage());
        }
        return timeline;
    }
}


