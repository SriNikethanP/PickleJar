package com.pickle_company.pickle.config;

import com.pickle_company.pickle.entity.Category;
import com.pickle_company.pickle.entity.Collection;
import com.pickle_company.pickle.repository.CategoryRepository;
import com.pickle_company.pickle.repository.CollectionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private CollectionRepository collectionRepository;

    @Override
    public void run(String... args) throws Exception {
        // Initialize categories if none exist
        if (categoryRepository.count() == 0) {
            Category electronics = Category.builder()
                    .name("Electronics")
                    .build();
            categoryRepository.save(electronics);

            Category clothing = Category.builder()
                    .name("Clothing")
                    .build();
            categoryRepository.save(clothing);

            Category home = Category.builder()
                    .name("Home & Garden")
                    .build();
            categoryRepository.save(home);

            Category sports = Category.builder()
                    .name("Sports & Outdoors")
                    .build();
            categoryRepository.save(sports);

            System.out.println("Sample categories created successfully!");
        }

        // Initialize collections if none exist
        if (collectionRepository.count() == 0) {
            Collection featuredProducts = Collection.builder()
                    .title("Featured Products")
                    .handle("featured-products")
                    .build();
            collectionRepository.save(featuredProducts);

            Collection newArrivals = Collection.builder()
                    .title("New Arrivals")
                    .handle("new-arrivals")
                    .build();
            collectionRepository.save(newArrivals);

            Collection bestSellers = Collection.builder()
                    .title("Best Sellers")
                    .handle("best-sellers")
                    .build();
            collectionRepository.save(bestSellers);

            Collection seasonal = Collection.builder()
                    .title("Seasonal Collection")
                    .handle("seasonal-collection")
                    .build();
            collectionRepository.save(seasonal);

            System.out.println("Sample collections created successfully!");
        }
    }
} 