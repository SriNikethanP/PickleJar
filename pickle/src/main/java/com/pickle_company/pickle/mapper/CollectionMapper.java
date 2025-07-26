package com.pickle_company.pickle.mapper;

import com.pickle_company.pickle.dto.CollectionDTO;
import com.pickle_company.pickle.entity.Collection;
import org.mapstruct.Mapper;
import java.util.List;

@Mapper(componentModel = "spring")
public interface CollectionMapper {
    CollectionDTO toDto(Collection collection);
    List<CollectionDTO> toDtoList(List<Collection> collections);
} 