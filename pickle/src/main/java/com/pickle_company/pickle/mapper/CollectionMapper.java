package com.pickle_company.pickle.mapper;

import com.pickle_company.pickle.dto.CollectionDTO;
import com.pickle_company.pickle.entity.Collection;
import org.springframework.stereotype.Component;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class CollectionMapper {
    
    public CollectionDTO toDto(Collection collection) {
        if (collection == null) {
            return null;
        }
        
        return CollectionDTO.builder()
                .id(collection.getId())
                .title(collection.getTitle())
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