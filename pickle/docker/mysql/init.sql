-- Initialize PickleJar database
USE pickle;

-- Create initial categories
INSERT INTO category (name) VALUES 
('Spicy Pickles'),
('Sweet Pickles'),
('Dill Pickles'),
('Bread & Butter Pickles'),
('Gherkins')
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- Create initial collections
INSERT INTO collection (title) VALUES 
('Summer Specials'),
('Winter Collection'),
('Organic Pickles'),
('Premium Selection'),
('Bulk Orders')
ON DUPLICATE KEY UPDATE title = VALUES(title);

-- Create admin user (password: admin123)
INSERT INTO users (full_name, email, mobile, password, role, banned) VALUES 
('Admin User', 'admin@picklejar.com', '1234567890', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa', 'ADMIN', false)
ON DUPLICATE KEY UPDATE email = VALUES(email);

-- Create sample products
INSERT INTO products (name, description, price, stock, active, category_id, collection_id) VALUES 
('Spicy Jalapeno Pickles', 'Hot and spicy jalapeno pickles with a kick', 12.99, 100, true, 1, 1),
('Sweet Bread & Butter', 'Classic sweet bread and butter pickles', 9.99, 150, true, 4, 2),
('Organic Dill Spears', 'Crispy organic dill pickle spears', 14.99, 75, true, 3, 3),
('Premium Gherkins', 'Small, crunchy premium gherkins', 11.99, 200, true, 5, 4)
ON DUPLICATE KEY UPDATE name = VALUES(name); 