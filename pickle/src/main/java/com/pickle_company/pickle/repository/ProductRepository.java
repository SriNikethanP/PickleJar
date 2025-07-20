package com.pickle_company.pickle.repository;

import com.pickle_company.pickle.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.*;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByCategory_Name(String name);
    List<Product> findByNameContainingIgnoreCase(String keyword);
    List<Product> findByStockGreaterThan(int minStock);
    List<Product> findByCategory_NameAndNameContainingIgnoreCase(String category, String keyword);

    List<Product> findByStockLessThanEqual(int threshold);
}

