package com.bookstore.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Map;
import java.util.UUID;

@RestController
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class UploadController {

    @PostMapping(value = "/api/items/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "File is empty"));
            }

            String uploadsDir = System.getProperty("user.dir") + File.separator + "uploads";
            File dir = new File(uploadsDir);
            if (!dir.exists()) dir.mkdirs();

            String original = StringUtils.cleanPath(file.getOriginalFilename());
            String ext = "";
            int i = original.lastIndexOf('.');
            if (i >= 0) ext = original.substring(i);
            String filename = UUID.randomUUID().toString() + ext;

            Path target = Paths.get(uploadsDir).resolve(filename);
            Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);

            String url = "/uploads/" + filename;
            return ResponseEntity.ok(Map.of("url", url));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "Upload failed: " + e.getMessage()));
        }
    }
}
