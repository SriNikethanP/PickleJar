package com.pickle_company.pickle.controller.v1;

import com.pickle_company.pickle.dto.CollectionDTO;
import com.pickle_company.pickle.service.CollectionService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/collections")
public class CollectionController {
    private final CollectionService collectionService;

    public CollectionController(CollectionService collectionService) {
        this.collectionService = collectionService;
    }

    @GetMapping
    public List<CollectionDTO> getAllCollections(@RequestParam(value = "handle", required = false) String handle) {
        if (handle != null) {
            CollectionDTO collection = collectionService.getByHandle(handle);
            return collection != null ? List.of(collection) : List.of();
        }
        return collectionService.getAllCollections();
    }
} 