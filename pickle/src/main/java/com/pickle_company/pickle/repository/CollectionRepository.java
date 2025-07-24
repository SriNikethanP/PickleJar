package com.pickle_company.pickle.repository;

import com.pickle_company.pickle.entity.Collection;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface CollectionRepository extends JpaRepository<Collection, Long> {
    Optional<Collection> findByHandle(String handle);
} 