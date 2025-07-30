package com.pickle_company.pickle.mapper;

import com.pickle_company.pickle.dto.CollectionDTO;
import com.pickle_company.pickle.entity.Collection;
import com.pickle_company.pickle.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class CollectionMapper {
    
    @Autowired
    private ProductRepository productRepository;
    
    public CollectionDTO toDto(Collection collection) {
        if (collection == null) {
            return null;
        }
        
        // Get product count for this collection
        long productCount = productRepository.countByCollectionId(collection.getId());
        
        return CollectionDTO.builder()
                .id(collection.getId())
                .title(collection.getTitle())
                .productCount(productCount)
                .build();
    }
    
    public List<CollectionDTO> toDtoList(List<Collection> collections) {
        if (collections == null) {
            return null;
        }
        
        return collections.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }
} 