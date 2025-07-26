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

    public CollectionDTO getById(Long id) {
        return collectionRepository.findById(id)
                .map(collectionMapper::toDto)
                .orElse(null);
    }

    public CollectionDTO createCollection(CollectionDTO collectionDTO) {
        Collection collection = Collection.builder()
                .title(collectionDTO.getTitle())
                .build();
        Collection saved = collectionRepository.save(collection);
        return collectionMapper.toDto(saved);
    }

    public CollectionDTO updateCollection(Long id, CollectionDTO collectionDTO) {
        return collectionRepository.findById(id)
                .map(existingCollection -> {
                    existingCollection.setTitle(collectionDTO.getTitle());
                    Collection updated = collectionRepository.save(existingCollection);
                    return collectionMapper.toDto(updated);
                })
                .orElse(null);
    }

    public boolean deleteCollection(Long id) {
        if (collectionRepository.existsById(id)) {
            collectionRepository.deleteById(id);
            return true;
        }
        return false;
    }
} 