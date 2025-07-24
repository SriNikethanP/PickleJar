package com.pickle_company.pickle.entity;


import jakarta.persistence.*;
import lombok.*;

import java.util.*;

@Entity
@Table(name = "products")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;

    @ElementCollection // Simple for file URLs/paths
    private List<String> imageUrls;

    private double price;
    private int stock;

    // Example: OneToMany
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL)
    private List<Review> reviews = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    @ManyToOne
    @JoinColumn(name = "collection_id")
    private Collection collection;
    private boolean active = true;
}
