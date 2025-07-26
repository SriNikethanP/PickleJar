package com.pickle_company.pickle.service;

import com.pickle_company.pickle.dto.ProductResponseDTO;
import com.pickle_company.pickle.mapper.ProductMapper;
import com.pickle_company.pickle.repository.OrderItemRepository;
import com.pickle_company.pickle.repository.ProductRepository;
import com.pickle_company.pickle.repository.OrderRepository;
import com.pickle_company.pickle.repository.UserRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

@Service
public class AdminReportService {
    private final OrderItemRepository orderItemRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final ProductMapper productMapper;
    private final UserRepository userRepository;

    public AdminReportService(OrderItemRepository orderItemRepository,
                              ProductRepository productRepository,
                              OrderRepository orderRepository,
                              ProductMapper productMapper,
                              UserRepository userRepository) {
        this.orderItemRepository = orderItemRepository;
        this.productRepository = productRepository;
        this.orderRepository = orderRepository;
        this.productMapper = productMapper;
        this.userRepository = userRepository;
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
        // Example: return [{date: '2024-05-01', revenue: 100.0}, ...]
        List<Map<String, Object>> trend = new java.util.ArrayList<>();
        LocalDate today = LocalDate.now();
        for (int i = 29; i >= 0; i--) {
            Map<String, Object> day = new HashMap<>();
            day.put("date", today.minusDays(i).format(DateTimeFormatter.ISO_DATE));
            day.put("revenue", Math.random() * 1000); // Replace with real query
            trend.add(day);
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
        List<Object[]> results = orderRepository.findMonthlyRevenue();
        List<Map<String, Object>> timeline = new java.util.ArrayList<>();
        for (Object[] row : results) {
            Map<String, Object> entry = new HashMap<>();
            entry.put("year", row[0]);
            entry.put("month", row[1]);
            entry.put("revenue", row[2]);
            timeline.add(entry);
        }
        return timeline;
    }
}


