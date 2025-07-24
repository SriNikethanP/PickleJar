package com.pickle_company.pickle.mapper;

import com.pickle_company.pickle.dto.CollectionDTO;
import com.pickle_company.pickle.entity.Collection;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import java.util.List;

@Mapper(componentModel = "spring", uses = ProductMapper.class)
public interface CollectionMapper {
    @Mapping(target = "products", source = "products")
    CollectionDTO toDto(Collection collection);
    List<CollectionDTO> toDtoList(List<Collection> collections);
} 