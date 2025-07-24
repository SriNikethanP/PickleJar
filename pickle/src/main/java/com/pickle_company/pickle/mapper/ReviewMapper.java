package com.pickle_company.pickle.mapper;

import com.pickle_company.pickle.dto.ReviewDTO;
import com.pickle_company.pickle.entity.Review;
import org.mapstruct.Mapper;
import java.util.List;

@Mapper(componentModel = "spring")
public interface ReviewMapper {
    ReviewDTO toDto(Review review);
    List<ReviewDTO> toDtoList(List<Review> reviews);
} 