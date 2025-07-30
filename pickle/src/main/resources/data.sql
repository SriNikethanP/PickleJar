-- Admin user creation (uncomment only for initial setup)
-- Password is BCrypt hash of "admin123"
INSERT INTO users (full_name, email, mobile, password, role, banned, address) 
VALUES (
    'Admin User', 
    'admin@picklejar.com', 
    '1234567890', 
    '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa', 
    'ADMIN', 
    false, 
    '{"street": "Admin Street", "city": "Admin City", "state": "Admin State", "zipCode": "12345", "country": "Admin Country"}'
) ON DUPLICATE KEY UPDATE 
    full_name = VALUES(full_name),
    mobile = VALUES(mobile),
    password = VALUES(password),
    role = VALUES(role),
    banned = VALUES(banned),
    address = VALUES(address); 