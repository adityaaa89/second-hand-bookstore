package com.bookstore.controller;

import com.bookstore.dto.ItemDto;
import com.bookstore.service.AuthService;
import com.bookstore.service.ItemService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/items")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000", "https://second-hand-bookstore.vercel.app"})
public class ItemController {
    
    @Autowired
    private ItemService itemService;
    
    @Autowired
    private AuthService authService;
    
    @GetMapping
    public ResponseEntity<Page<ItemDto>> getAllItems(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        
        Page<ItemDto> items = itemService.getAllItems(page, size, sortBy, sortDir);
        return ResponseEntity.ok(items);
    }
    
    @GetMapping("/search")
    public ResponseEntity<Page<ItemDto>> searchItems(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String condition,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) String searchTerm,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        
        Page<ItemDto> items = itemService.searchItems(
            category, condition, minPrice, maxPrice, searchTerm, page, size, sortBy, sortDir);
        return ResponseEntity.ok(items);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ItemDto> getItemById(@PathVariable Long id) {
        try {
            ItemDto item = itemService.getItemById(id);
            return ResponseEntity.ok(item);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PostMapping
    public ResponseEntity<?> createItem(@Valid @RequestBody ItemDto itemDto) {
        try {
            var user = authService.getCurrentUser();
            ItemDto createdItem = itemService.createItem(itemDto, user.getId());
            return ResponseEntity.ok(createdItem);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to create item: " + e.getMessage());
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updateItem(@PathVariable Long id, @Valid @RequestBody ItemDto itemDto) {
        try {
            var user = authService.getCurrentUser();
            ItemDto updatedItem = itemService.updateItem(id, itemDto, user.getId());
            return ResponseEntity.ok(updatedItem);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to update item: " + e.getMessage());
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteItem(@PathVariable Long id) {
        try {
            var user = authService.getCurrentUser();
            // Allow admin to delete any item, regular users can only delete their own
            if (user.getRole().equals(com.bookstore.entity.User.Role.ADMIN)) {
                itemService.deleteItemByAdmin(id);
            } else {
                itemService.deleteItem(id, user.getId());
            }
            return ResponseEntity.ok().body("Item deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to delete item: " + e.getMessage());
        }
    }
    
    @GetMapping("/my-items")
    public ResponseEntity<Page<ItemDto>> getMyItems(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        try {
            var user = authService.getCurrentUser();
            Page<ItemDto> items = itemService.getUserItems(user.getId(), page, size);
            return ResponseEntity.ok(items);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/conditions")
    public ResponseEntity<?> getAvailableConditions() {
        try {
            var conditions = itemService.getAvailableConditions();
            return ResponseEntity.ok(conditions);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to get conditions: " + e.getMessage());
        }
    }
}
