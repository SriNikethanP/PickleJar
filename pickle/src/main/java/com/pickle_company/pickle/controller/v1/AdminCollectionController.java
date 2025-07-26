package com.pickle_company.pickle.controller.v1;

import com.pickle_company.pickle.dto.CollectionDTO;
import com.pickle_company.pickle.service.CollectionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/collections")
public class AdminCollectionController {
    
    private final CollectionService collectionService;
    
    @Autowired
    public AdminCollectionController(CollectionService collectionService) {
        this.collectionService = collectionService;
    }
    
    @GetMapping
    public ResponseEntity<List<CollectionDTO>> getAllCollections() {
        return ResponseEntity.ok(collectionService.getAllCollections());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<CollectionDTO> getCollectionById(@PathVariable Long id) {
        CollectionDTO collection = collectionService.getById(id);
        if (collection != null) {
            return ResponseEntity.ok(collection);
        }
        return ResponseEntity.notFound().build();
    }
    
    @PostMapping
    public ResponseEntity<CollectionDTO> createCollection(@RequestBody CollectionDTO collectionDTO) {
        CollectionDTO created = collectionService.createCollection(collectionDTO);
        return ResponseEntity.ok(created);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<CollectionDTO> updateCollection(@PathVariable Long id, @RequestBody CollectionDTO collectionDTO) {
        CollectionDTO updated = collectionService.updateCollection(id, collectionDTO);
        if (updated != null) {
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.notFound().build();
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCollection(@PathVariable Long id) {
        boolean deleted = collectionService.deleteCollection(id);
        if (deleted) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
} 