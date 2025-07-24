package com.pickle_company.pickle.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Collection {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String handle;

    @OneToMany(mappedBy = "collection")
    private List<Product> products = new ArrayList<>();
} 