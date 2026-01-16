package com.bookstore.dto;

import java.math.BigDecimal;

public class AdminStatsDto {
    private Long totalUsers;
    private Long totalItems;
    private Long totalCategories;
    private BigDecimal totalItemsValue;
    private Long activeUsers;
    private Long adminUsers;
    
    public AdminStatsDto() {}
    
    public AdminStatsDto(Long totalUsers, Long totalItems, Long totalCategories, 
                        BigDecimal totalItemsValue, Long activeUsers, Long adminUsers) {
        this.totalUsers = totalUsers;
        this.totalItems = totalItems;
        this.totalCategories = totalCategories;
        this.totalItemsValue = totalItemsValue;
        this.activeUsers = activeUsers;
        this.adminUsers = adminUsers;
    }
    
    // Getters and Setters
    public Long getTotalUsers() {
        return totalUsers;
    }
    
    public void setTotalUsers(Long totalUsers) {
        this.totalUsers = totalUsers;
    }
    
    public Long getTotalItems() {
        return totalItems;
    }
    
    public void setTotalItems(Long totalItems) {
        this.totalItems = totalItems;
    }
    
    public Long getTotalCategories() {
        return totalCategories;
    }
    
    public void setTotalCategories(Long totalCategories) {
        this.totalCategories = totalCategories;
    }
    
    public BigDecimal getTotalItemsValue() {
        return totalItemsValue;
    }
    
    public void setTotalItemsValue(BigDecimal totalItemsValue) {
        this.totalItemsValue = totalItemsValue;
    }
    
    public Long getActiveUsers() {
        return activeUsers;
    }
    
    public void setActiveUsers(Long activeUsers) {
        this.activeUsers = activeUsers;
    }
    
    public Long getAdminUsers() {
        return adminUsers;
    }
    
    public void setAdminUsers(Long adminUsers) {
        this.adminUsers = adminUsers;
    }
}
