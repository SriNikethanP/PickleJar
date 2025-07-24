package com.pickle_company.pickle.dto;

import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewDTO {
    private Long id;
    private String username;
    private int rating;
    private LocalDateTime createdAt;
}
