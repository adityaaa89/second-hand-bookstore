package com.bookstore.repository;

import com.bookstore.entity.Item;
import com.bookstore.entity.Category;
import com.bookstore.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface ItemRepository extends JpaRepository<Item, Long> {
    
    Page<Item> findByIsAvailableTrue(Pageable pageable);
    
    Page<Item> findByCategoryAndIsAvailableTrue(Category category, Pageable pageable);
    
    Page<Item> findBySellerAndIsAvailableTrue(User seller, Pageable pageable);
    
    @Query("SELECT i FROM Item i WHERE i.isAvailable = true AND " +
           "(:category IS NULL OR i.category.name = :category) AND " +
           "(:condition IS NULL OR i.condition = :condition) AND " +
           "(:minPrice IS NULL OR i.price >= :minPrice) AND " +
           "(:maxPrice IS NULL OR i.price <= :maxPrice) AND " +
           "(:searchTerm IS NULL OR LOWER(i.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')))")
    Page<Item> findItemsWithFilters(
        @Param("category") String category,
        @Param("condition") Item.Condition condition,
        @Param("minPrice") BigDecimal minPrice,
        @Param("maxPrice") BigDecimal maxPrice,
        @Param("searchTerm") String searchTerm,
        Pageable pageable);
    
    @Query("SELECT DISTINCT i.condition FROM Item i WHERE i.isAvailable = true")
    List<Item.Condition> findDistinctConditions();
    
    @Query("SELECT COUNT(i) FROM Item i WHERE i.seller = :seller AND i.isAvailable = true")
    long countBySellerAndIsAvailableTrue(@Param("seller") User seller);
    
    @Query("SELECT COUNT(i) FROM Item i WHERE i.seller.id = :sellerId")
    Long countBySellerId(@Param("sellerId") Long sellerId);
    
    @Query("SELECT SUM(i.price) FROM Item i WHERE i.seller.id = :sellerId")
    BigDecimal getTotalValueBySellerId(@Param("sellerId") Long sellerId);
    
    @Query("SELECT SUM(i.price) FROM Item i")
    BigDecimal getTotalItemsValue();
    
}
