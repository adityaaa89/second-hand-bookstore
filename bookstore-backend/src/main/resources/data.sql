-- Insert default categories
INSERT INTO categories (name, description, created_at) VALUES 
('Books', 'Fiction and non-fiction books', NOW()),
('Textbooks', 'Academic textbooks and study materials', NOW()),
('Stationery', 'Pens, notebooks, and office supplies', NOW()),
('School Supplies', 'General school and educational supplies', NOW());

-- Insert sample users (passwords are 'password123' encoded with BCrypt)
INSERT INTO users (full_name, email, password, role, created_at) VALUES 
('John Doe', 'john@example.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', 'USER', NOW()),
('Jane Smith', 'jane@example.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', 'USER', NOW()),
('Admin User', 'admin@example.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', 'ADMIN', NOW());

-- Insert sample items
INSERT INTO items (name, price, image_url, condition_status, description, is_available, created_at, category_id, seller_id) VALUES 
('Introduction to Computer Science', 2500.00, 'https://images.unsplash.com/photo-1561121587-28c15de34c17?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib29rcyUyMHN0YWNrJTIwbGl0ZXJhdHVyZXxlbnwxfHx8fDE3NTczMzcwNjB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', 'EXCELLENT', 'Comprehensive textbook covering fundamental computer science concepts', true, NOW(), 2, 1),
('Vintage Literature Collection', 1200.00, 'https://images.unsplash.com/photo-1754905947342-16e4e21f2077?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvbGQlMjBib29rcyUyMHZpbnRhZ2V8ZW58MXx8fHwxNzU3MzgxMjczfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', 'GOOD', 'Classic literature books in good condition', true, NOW(), 1, 2),
('Premium Stationery Set', 800.00, 'https://images.unsplash.com/photo-1601311911926-dbdae16e54c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxub3RlYm9va3MlMjBzdGF0aW9uYXJ5JTIwcGVuc3xlbnwxfHx8fDE3NTczODEyNzR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', 'NEW', 'High-quality pens, notebooks, and writing supplies', true, NOW(), 3, 1),
('Medical Study Books', 1800.00, 'https://images.unsplash.com/photo-1707586234446-a1338e496161?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZXh0Ym9va3MlMjBzdHVkeSUyMGJvb2tzfGVufDF8fHx8MTc1NzI2OTkwNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', 'VERY_GOOD', 'Medical textbooks for students', true, NOW(), 2, 2),
('School Supply Bundle', 500.00, 'https://images.unsplash.com/photo-1623228639000-3c9f7908dc88?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2hvb2wlMjBzdXBwbGllcyUyMHBlbmNpbHN8ZW58MXx8fHwxNzU3MzgxMjc1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', 'GOOD', 'Complete set of school supplies', true, NOW(), 4, 1),
('Antique Leather Bound Books', 3500.00, 'https://images.unsplash.com/photo-1690507369594-b370f7d72868?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbnRpcXVlJTIwYm9va3MlMjBsZWF0aGVyfGVufDF8fHx8MTc1NzM4MTI3NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', 'FAIR', 'Rare antique books with leather binding', true, NOW(), 1, 2);
