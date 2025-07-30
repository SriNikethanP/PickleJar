package com.pickle_company.pickle.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DeleteImageRequest {
    private String imageUrl;
} 