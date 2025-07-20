package com.pickle_company.pickle.service;

import com.pickle_company.pickle.dto.ProductResponseDTO;
import com.pickle_company.pickle.mapper.ProductMapper;
import com.pickle_company.pickle.repository.OrderItemRepository;
import com.pickle_company.pickle.repository.ProductRepository;
import com.pickle_company.pickle.repository.OrderRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminReportService {
    private final OrderItemRepository orderItemRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final ProductMapper productMapper;

    public AdminReportService(OrderItemRepository orderItemRepository,
                              ProductRepository productRepository,
                              OrderRepository orderRepository,
                              ProductMapper productMapper) {
        this.orderItemRepository = orderItemRepository;
        this.productRepository = productRepository;
        this.orderRepository = orderRepository;
        this.productMapper = productMapper;
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
}


