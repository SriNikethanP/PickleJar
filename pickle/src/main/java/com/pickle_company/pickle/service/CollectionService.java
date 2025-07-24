package com.pickle_company.pickle.service;

import com.pickle_company.pickle.dto.CollectionDTO;
import com.pickle_company.pickle.entity.Collection;
import com.pickle_company.pickle.mapper.CollectionMapper;
import com.pickle_company.pickle.repository.CollectionRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CollectionService {
    private final CollectionRepository collectionRepository;
    private final CollectionMapper collectionMapper;

    public CollectionService(CollectionRepository collectionRepository, CollectionMapper collectionMapper) {
        this.collectionRepository = collectionRepository;
        this.collectionMapper = collectionMapper;
    }

    public List<CollectionDTO> getAllCollections() {
        return collectionMapper.toDtoList(collectionRepository.findAll());
    }

    public CollectionDTO getByHandle(String handle) {
        return collectionRepository.findByHandle(handle)
                .map(collectionMapper::toDto)
                .orElse(null);
    }
} 