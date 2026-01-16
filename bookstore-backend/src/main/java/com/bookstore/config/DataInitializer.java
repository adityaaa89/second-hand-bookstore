package com.bookstore.config;

import com.bookstore.entity.Category;
import com.bookstore.entity.User;
import com.bookstore.entity.Item;
import com.bookstore.repository.CategoryRepository;
import com.bookstore.repository.UserRepository;
import com.bookstore.repository.ItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.math.BigDecimal;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ItemRepository itemRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Only initialize if no data exists
        if (userRepository.count() == 0) {
            initializeData();
        }
    }

    private void initializeData() {
        // Create categories
        Category booksCategory = new Category();
        booksCategory.setName("Books");
        booksCategory.setDescription("Fiction and non-fiction books");
        booksCategory.setCreatedAt(LocalDateTime.now());
        categoryRepository.save(booksCategory);

        Category textbooksCategory = new Category();
        textbooksCategory.setName("Textbooks");
        textbooksCategory.setDescription("Academic textbooks and study materials");
        textbooksCategory.setCreatedAt(LocalDateTime.now());
        categoryRepository.save(textbooksCategory);

        Category stationeryCategory = new Category();
        stationeryCategory.setName("Stationery");
        stationeryCategory.setDescription("Pens, notebooks, and office supplies");
        stationeryCategory.setCreatedAt(LocalDateTime.now());
        categoryRepository.save(stationeryCategory);

        Category schoolSuppliesCategory = new Category();
        schoolSuppliesCategory.setName("School Supplies");
        schoolSuppliesCategory.setDescription("General school and educational supplies");
        schoolSuppliesCategory.setCreatedAt(LocalDateTime.now());
        categoryRepository.save(schoolSuppliesCategory);

        // Create users
        User john = new User();
        john.setFullName("John Doe");
        john.setEmail("john@example.com");
        john.setPassword(passwordEncoder.encode("password123"));
        john.setRole(User.Role.USER);
        john.setCreatedAt(LocalDateTime.now());
        userRepository.save(john);

        User jane = new User();
        jane.setFullName("Jane Smith");
        jane.setEmail("jane@example.com");
        jane.setPassword(passwordEncoder.encode("password123"));
        jane.setRole(User.Role.USER);
        jane.setCreatedAt(LocalDateTime.now());
        userRepository.save(jane);

        User admin = new User();
        admin.setFullName("Admin User");
        admin.setEmail("admin@example.com");
        admin.setPassword(passwordEncoder.encode("password123"));
        admin.setRole(User.Role.ADMIN);
        admin.setCreatedAt(LocalDateTime.now());
        userRepository.save(admin);

        // Create sample items
        Item item1 = new Item();
        item1.setName("Introduction to Computer Science");
        item1.setPrice(new BigDecimal("2500.00"));
        item1.setImageUrl("https://images.unsplash.com/photo-1561121587-28c15de34c17?w=400&h=300&fit=crop");
        item1.setCondition(Item.Condition.EXCELLENT);
        item1.setDescription("Comprehensive textbook covering fundamental computer science concepts");
        item1.setIsAvailable(true);
        item1.setCreatedAt(LocalDateTime.now());
        item1.setCategory(textbooksCategory);
        item1.setSeller(john);
        itemRepository.save(item1);

        Item item2 = new Item();
        item2.setName("Vintage Literature Collection");
        item2.setPrice(new BigDecimal("1200.00"));
        item2.setImageUrl("https://images.unsplash.com/photo-1754905947342-16e4e21f2077?w=400&h=300&fit=crop");
        item2.setCondition(Item.Condition.GOOD);
        item2.setDescription("Classic literature books in good condition");
        item2.setIsAvailable(true);
        item2.setCreatedAt(LocalDateTime.now());
        item2.setCategory(booksCategory);
        item2.setSeller(jane);
        itemRepository.save(item2);

        Item item3 = new Item();
        item3.setName("Premium Stationery Set");
        item3.setPrice(new BigDecimal("800.00"));
        item3.setImageUrl("https://images.unsplash.com/photo-1601311911926-dbdae16e54c9?w=400&h=300&fit=crop");
        item3.setCondition(Item.Condition.NEW);
        item3.setDescription("High-quality pens, notebooks, and writing supplies");
        item3.setIsAvailable(true);
        item3.setCreatedAt(LocalDateTime.now());
        item3.setCategory(stationeryCategory);
        item3.setSeller(john);
        itemRepository.save(item3);

        System.out.println("Data initialization completed successfully!");
    }
}
