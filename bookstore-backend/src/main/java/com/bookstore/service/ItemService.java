package com.bookstore.service;

import com.bookstore.dto.ItemDto;
import com.bookstore.entity.Category;
import com.bookstore.entity.Item;
import com.bookstore.entity.User;
import com.bookstore.repository.CategoryRepository;
import com.bookstore.repository.ItemRepository;
import com.bookstore.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@Transactional
public class ItemService {
    
    @Autowired
    private ItemRepository itemRepository;
    
    @Autowired
    private CategoryRepository categoryRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    public Page<ItemDto> getAllItems(int page, int size, String sortBy, String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
            Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<Item> items = itemRepository.findByIsAvailableTrue(pageable);
        return items.map(this::convertToDto);
    }
    
    public Page<ItemDto> searchItems(String category, String condition, BigDecimal minPrice, 
                                   BigDecimal maxPrice, String searchTerm, int page, int size, 
                                   String sortBy, String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
            Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        // Handle empty strings by converting them to null
        String categoryFilter = (category == null || category.trim().isEmpty()) ? null : category;
        String conditionFilter = (condition == null || condition.trim().isEmpty()) ? null : condition;
        String searchFilter = (searchTerm == null || searchTerm.trim().isEmpty()) ? null : searchTerm;

        // Convert condition string to Item.Condition enum if provided
        Item.Condition conditionEnum = null;
        if (conditionFilter != null) {
            try {
                conditionEnum = Item.Condition.valueOf(conditionFilter.toUpperCase());
            } catch (IllegalArgumentException e) {
                // If the provided condition doesn't match enum values, ignore the filter
                conditionEnum = null;
            }
        }

        Page<Item> items = itemRepository.findItemsWithFilters(
            categoryFilter, conditionEnum, minPrice, maxPrice, searchFilter, pageable);
        return items.map(this::convertToDto);
    }
    
    public ItemDto getItemById(Long id) {
        Item item = itemRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Item not found with id: " + id));
        return convertToDto(item);
    }
    
    public ItemDto createItem(ItemDto itemDto, Long userId) {
        User seller = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        
        Category category = categoryRepository.findById(itemDto.getCategoryId())
            .orElseThrow(() -> new RuntimeException("Category not found with id: " + itemDto.getCategoryId()));
        
        Item item = new Item(
            itemDto.getName(),
            itemDto.getPrice(),
            itemDto.getImageUrl(),
            itemDto.getCondition(),
            itemDto.getDescription(),
            category,
            seller
        );
        
        item = itemRepository.save(item);
        return convertToDto(item);
    }
    
    public ItemDto updateItem(Long id, ItemDto itemDto, Long userId) {
        Item item = itemRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Item not found with id: " + id));
        
        // Check if user is the owner
        if (!item.getSeller().getId().equals(userId)) {
            throw new RuntimeException("You are not authorized to update this item");
        }
        
        Category category = categoryRepository.findById(itemDto.getCategoryId())
            .orElseThrow(() -> new RuntimeException("Category not found with id: " + itemDto.getCategoryId()));
        
        item.setName(itemDto.getName());
        item.setPrice(itemDto.getPrice());
        item.setImageUrl(itemDto.getImageUrl());
        item.setCondition(itemDto.getCondition());
        item.setDescription(itemDto.getDescription());
        item.setCategory(category);
        item.setIsAvailable(itemDto.getIsAvailable());
        
        item = itemRepository.save(item);
        return convertToDto(item);
    }
    
    public void deleteItem(Long id, Long userId) {
        Item item = itemRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Item not found with id: " + id));
        
        // Check if user is the owner
        if (!item.getSeller().getId().equals(userId)) {
            throw new RuntimeException("You are not authorized to delete this item");
        }
        
        itemRepository.delete(item);
    }
    
    public void deleteItemByAdmin(Long id) {
        Item item = itemRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Item not found with id: " + id));
        
        itemRepository.delete(item);
    }
    
    public Page<ItemDto> getUserItems(Long userId, int page, int size) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        
        Pageable pageable = PageRequest.of(page, size);
        Page<Item> items = itemRepository.findBySellerAndIsAvailableTrue(user, pageable);
        return items.map(this::convertToDto);
    }
    
    public List<Item.Condition> getAvailableConditions() {
        return itemRepository.findDistinctConditions();
    }
    
    private ItemDto convertToDto(Item item) {
        return new ItemDto(
            item.getId(),
            item.getName(),
            item.getPrice(),
            item.getImageUrl(),
            item.getCondition(),
            item.getDescription(),
            item.getIsAvailable(),
            item.getCreatedAt(),
            item.getUpdatedAt(),
            item.getCategory().getName(),
            item.getCategory().getId(),
            item.getSeller().getFullName(),
            item.getSeller().getEmail(),
            item.getSeller().getId()
        );
    }
}
