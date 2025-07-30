package com.pickle_company.pickle.controller.v1;

import com.pickle_company.pickle.dto.ProductResponseDTO;
import com.pickle_company.pickle.service.AdminReportService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import com.pickle_company.pickle.entity.Category;
import com.pickle_company.pickle.repository.CategoryRepository;
import com.pickle_company.pickle.repository.ProductRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.*;

@RestController
@RequestMapping("/api/v1/admin/reports")
public class AdminReportController {
    private final AdminReportService reportService;
    private final CategoryRepository categoryRepo;
    private final ProductRepository productRepo;

    public AdminReportController(AdminReportService reportService, CategoryRepository categoryRepo, ProductRepository productRepo) {
        this.reportService = reportService;
        this.categoryRepo = categoryRepo;
        this.productRepo = productRepo;
    }

    @GetMapping("/popular")
    public List<ProductResponseDTO> getPopular(@RequestParam(defaultValue="5") int limit) {
        return reportService.getPopularProducts(limit);
    }

    @GetMapping("/total-sales")
    public double getTotalSales() {
        return reportService.getTotalSales();
    }

    @GetMapping("/low-stock")
    public List<ProductResponseDTO> getLowStock(@RequestParam(defaultValue="5") int threshold) {
        return reportService.getLowStockProducts(threshold);
    }

    @GetMapping("/revenue-trend")
    public List<Map<String, Object>> getRevenueTrend() {
        return reportService.getRevenueTrendLast30Days();
    }

    @GetMapping("/category-distribution")
    public List<Map<String, Object>> getCategoryDistribution() {
        List<Category> categories = categoryRepo.findAll();
        List<Map<String, Object>> result = new ArrayList<>();
        for (Category category : categories) {
            long count = productRepo.countByCategoryId(category.getId());
            Map<String, Object> entry = new HashMap<>();
            entry.put("name", category.getName());
            entry.put("value", count);
            result.add(entry);
        }
        return result;
    }

    @GetMapping("/total-orders")
    public int getTotalOrders() {
        return reportService.getTotalOrders();
    }

    @GetMapping("/total-customers")
    public int getTotalCustomers() {
        return reportService.getTotalCustomers();
    }

    @GetMapping("/monthly-revenue-timeline")
    public List<Map<String, Object>> getMonthlyRevenueTimeline() {
        return reportService.getMonthlyRevenueTimeline();
    }
}
