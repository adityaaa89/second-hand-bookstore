package com.bookstore.service;

import com.bookstore.dto.AdminStatsDto;
import com.bookstore.dto.UserAnalyticsDto;
import com.bookstore.entity.User;
import com.bookstore.repository.ItemRepository;
import com.bookstore.repository.UserRepository;
import com.bookstore.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private ItemRepository itemRepository;
    
    @Autowired
    private CategoryRepository categoryRepository;
    
    public AdminStatsDto getAdminStats() {
        Long totalUsers = userRepository.count();
        Long totalItems = itemRepository.count();
        Long totalCategories = categoryRepository.count();
        BigDecimal totalItemsValue = itemRepository.getTotalItemsValue();
        Long activeUsers = userRepository.countByItemsIsNotNull();
        Long adminUsers = userRepository.countByRole(User.Role.ADMIN);
        
        return new AdminStatsDto(
            totalUsers,
            totalItems,
            totalCategories,
            totalItemsValue != null ? totalItemsValue : BigDecimal.ZERO,
            activeUsers,
            adminUsers
        );
    }
    
    public Page<UserAnalyticsDto> getAllUsers(Pageable pageable) {
        return userRepository.findAll(pageable)
            .map(user -> {
                Long itemCount = itemRepository.countBySellerId(user.getId());
                BigDecimal totalValue = itemRepository.getTotalValueBySellerId(user.getId());
                
                return new UserAnalyticsDto(
                    user.getId(),
                    user.getFullName(),
                    user.getEmail(),
                    user.getRole().name(),
                    user.getCreatedAt(),
                    itemCount,
                    totalValue != null ? totalValue.longValue() : 0L
                );
            });
    }
    
    public List<UserAnalyticsDto> getAllUsersList() {
        return userRepository.findAll().stream()
            .map(user -> {
                Long itemCount = itemRepository.countBySellerId(user.getId());
                BigDecimal totalValue = itemRepository.getTotalValueBySellerId(user.getId());
                
                return new UserAnalyticsDto(
                    user.getId(),
                    user.getFullName(),
                    user.getEmail(),
                    user.getRole().name(),
                    user.getCreatedAt(),
                    itemCount,
                    totalValue != null ? totalValue.longValue() : 0L
                );
            })
            .collect(Collectors.toList());
    }
}
