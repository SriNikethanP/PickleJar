package com.pickle_company.pickle.controller.v1;

import com.pickle_company.pickle.dto.ProductResponseDTO;
import com.pickle_company.pickle.service.AdminReportService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/reports")
public class AdminReportController {
    private final AdminReportService reportService;

    public AdminReportController(AdminReportService reportService) {
        this.reportService = reportService;
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
}
