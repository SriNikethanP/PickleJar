package com.pickle_company.pickle.repository;

import com.pickle_company.pickle.entity.Collection;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CollectionRepository extends JpaRepository<Collection, Long> {
} 