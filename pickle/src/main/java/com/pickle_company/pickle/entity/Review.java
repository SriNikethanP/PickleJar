package com.pickle_company.pickle.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "reviews")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Review {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(nullable = false)
    private String username; // Simpler than full User
    
    @Column(nullable = false)
    private int rating; // 1-5, for example
    
    @Column(columnDefinition = "TEXT")
    private String comment; // Review comment
    
    @Column(nullable = false)
    private LocalDateTime createdAt;
    
    @Builder.Default
    private boolean verified = false; // Whether the review is from a verified purchase
}
