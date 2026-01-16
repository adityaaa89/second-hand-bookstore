package com.bookstore.controller;

import com.bookstore.dto.AdminStatsDto;
import com.bookstore.dto.UserAnalyticsDto;
import com.bookstore.entity.User;
import com.bookstore.service.AdminService;
import com.bookstore.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000", "https://second-hand-bookstore-no3iu991a-adityagupta9a24-7322s-projects.vercel.app"})
public class AdminController {
    
    @Autowired
    private AdminService adminService;
    
    @Autowired
    private AuthService authService;
    
    @GetMapping("/stats")
    public ResponseEntity<AdminStatsDto> getAdminStats() {
        try {
            User currentUser = authService.getCurrentUser();
            if (!currentUser.getRole().equals(User.Role.ADMIN)) {
                return ResponseEntity.status(403).build();
            }
            
            AdminStatsDto stats = adminService.getAdminStats();
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/users")
    public ResponseEntity<Page<UserAnalyticsDto>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            User currentUser = authService.getCurrentUser();
            if (!currentUser.getRole().equals(User.Role.ADMIN)) {
                return ResponseEntity.status(403).build();
            }
            
            Pageable pageable = PageRequest.of(page, size);
            Page<UserAnalyticsDto> users = adminService.getAllUsers(pageable);
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/users/all")
    public ResponseEntity<?> getAllUsersList() {
        try {
            User currentUser = authService.getCurrentUser();
            if (!currentUser.getRole().equals(User.Role.ADMIN)) {
                return ResponseEntity.status(403).build();
            }
            
            return ResponseEntity.ok(adminService.getAllUsersList());
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
