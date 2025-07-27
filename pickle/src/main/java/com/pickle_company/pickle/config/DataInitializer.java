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
            Category spicyPickles = Category.builder()
                    .name("Spicy Pickles")
                    .build();
            categoryRepository.save(spicyPickles);

            Category sweetPickles = Category.builder()
                    .name("Sweet Pickles")
                    .build();
            categoryRepository.save(sweetPickles);

            Category dillPickles = Category.builder()
                    .name("Dill Pickles")
                    .build();
            categoryRepository.save(dillPickles);

            Category breadButterPickles = Category.builder()
                    .name("Bread & Butter Pickles")
                    .build();
            categoryRepository.save(breadButterPickles);

            Category gherkins = Category.builder()
                    .name("Gherkins")
                    .build();
            categoryRepository.save(gherkins);

            System.out.println("Pickle categories created successfully!");
        }

        // Initialize collections if none exist
        if (collectionRepository.count() == 0) {
            Collection summerSpecials = Collection.builder()
                    .title("Summer Specials")
                    .build();
            collectionRepository.save(summerSpecials);

            Collection winterCollection = Collection.builder()
                    .title("Winter Collection")
                    .build();
            collectionRepository.save(winterCollection);

            Collection organicPickles = Collection.builder()
                    .title("Organic Pickles")
                    .build();
            collectionRepository.save(organicPickles);

            Collection premiumSelection = Collection.builder()
                    .title("Premium Selection")
                    .build();
            collectionRepository.save(premiumSelection);

            Collection bulkOrders = Collection.builder()
                    .title("Bulk Orders")
                    .build();
            collectionRepository.save(bulkOrders);

            System.out.println("Pickle collections created successfully!");
        }
    }
} 