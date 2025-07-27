-- Fix database schema for PickleJar
USE pickle;

-- Make category_id and collection_id nullable in products table
ALTER TABLE products MODIFY COLUMN category_id BIGINT NULL;
ALTER TABLE products MODIFY COLUMN collection_id BIGINT NULL;

-- Drop existing foreign key constraints if they exist
ALTER TABLE products DROP FOREIGN KEY IF EXISTS FK1cf90etcu98x1e6n9aks3tel3;
ALTER TABLE products DROP FOREIGN KEY IF EXISTS FK_products_collection;

-- Add new foreign key constraints with proper names
ALTER TABLE products 
ADD CONSTRAINT FK_products_category 
FOREIGN KEY (category_id) REFERENCES category(id);

ALTER TABLE products 
ADD CONSTRAINT FK_products_collection 
FOREIGN KEY (collection_id) REFERENCES collection(id);

-- Ensure category and collection tables exist with correct names
-- If they don't exist, they will be created by Hibernate 