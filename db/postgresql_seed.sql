-- Insert products
INSERT INTO Products (Name, Category, Price, OldPrice, Description, Material, Dimensions, Weight, Rating, ReviewCount, ImageUrl, IsFeatured, IsBestSeller, Status)
VALUES 
    ('Elegant Tote Bag', 'Bags', 89.99, 99.99, 'A stylish and elegant tote bag perfect for everyday use. Made with premium materials and designed for durability and fashion.', 'Premium Leather', '30cm x 40cm x 10cm', 800, 4.5, 128, 'https://placehold.co/400x400/pink/white?text=Elegant+Tote+Bag', TRUE, TRUE, 'In Stock'),
    ('Leather Wallet', 'Accessories', 45.00, 55.00, 'A premium leather wallet with multiple card slots and compartments. Slim design fits perfectly in your pocket.', 'Genuine Leather', '10cm x 8cm x 1cm', 150, 4.2, 85, 'https://via.placeholder.com/400?text=Wallet', FALSE, FALSE, 'In Stock'),
    ('Fashion Bracelet', 'Jewelry', 29.99, NULL, 'A beautiful fashion bracelet that adds elegance to any outfit. Perfect for daily wear or special occasions.', 'Stainless Steel, Cubic Zirconia', 'Adjustable', 50, 4.8, 64, 'https://via.placeholder.com/400?text=Bracelet', TRUE, FALSE, 'Low Stock'),
    ('Stylish Sunglasses', 'Accessories', 59.99, 79.99, 'Trendy sunglasses with UV protection. Lightweight frame and polarized lenses for maximum comfort.', 'Acetate Frame, Polarized Lenses', 'Standard Size', 120, 4.0, 42, 'https://via.placeholder.com/400?text=Sunglasses', FALSE, FALSE, 'Out of Stock'),
    ('Designer Watch', 'Watches', 129.99, NULL, 'Elegant designer watch with premium materials. Water-resistant and perfect for any occasion.', 'Stainless Steel, Mineral Glass', '40mm Case', 180, 4.7, 93, 'https://via.placeholder.com/400', TRUE, TRUE, 'In Stock');

-- Insert gallery images for product 1
INSERT INTO GalleryImages (ProductId, ImageUrl)
VALUES 
    (1, 'https://placehold.co/400x400/pink/white?text=Elegant+Tote+Bag+1'),
    (1, 'https://placehold.co/400x400/pink/white?text=Elegant+Tote+Bag+2'),
    (1, 'https://placehold.co/400x400/pink/white?text=Elegant+Tote+Bag+3');

-- Insert colors for product 1
INSERT INTO ProductColors (ProductId, Color)
VALUES 
    (1, 'Black'),
    (1, 'Brown'),
    (1, 'Pink');

-- Insert tags for product 1
INSERT INTO ProductTags (ProductId, Tag)
VALUES 
    (1, 'Luxury'),
    (1, 'Fashion'),
    (1, 'Trending');

-- Insert features for product 1
INSERT INTO ProductFeatures (ProductId, Feature)
VALUES 
    (1, 'Premium quality materials'),
    (1, 'Adjustable straps'),
    (1, 'Multiple compartments'),
    (1, 'Waterproof lining');

-- Insert gallery images for product 2
INSERT INTO GalleryImages (ProductId, ImageUrl)
VALUES 
    (2, 'https://via.placeholder.com/400?text=Wallet+1'),
    (2, 'https://via.placeholder.com/400?text=Wallet+2');

-- Insert colors for product 2
INSERT INTO ProductColors (ProductId, Color)
VALUES 
    (2, 'Black'),
    (2, 'Brown');

-- Insert tags for product 2
INSERT INTO ProductTags (ProductId, Tag)
VALUES 
    (2, 'Accessories'),
    (2, 'Men'),
    (2, 'Gift');

-- Insert features for product 2
INSERT INTO ProductFeatures (ProductId, Feature)
VALUES 
    (2, 'Genuine leather'),
    (2, 'Multiple card slots'),
    (2, 'Bill compartment'),
    (2, 'RFID protection');

-- Insert gallery images for product 3
INSERT INTO GalleryImages (ProductId, ImageUrl)
VALUES 
    (3, 'https://via.placeholder.com/400?text=Bracelet+1'),
    (3, 'https://via.placeholder.com/400?text=Bracelet+2');

-- Insert colors for product 3
INSERT INTO ProductColors (ProductId, Color)
VALUES 
    (3, 'Silver'),
    (3, 'Gold'),
    (3, 'Rose Gold');

-- Insert tags for product 3
INSERT INTO ProductTags (ProductId, Tag)
VALUES 
    (3, 'Jewelry'),
    (3, 'Fashion'),
    (3, 'Gift'),
    (3, 'Women');

-- Insert features for product 3
INSERT INTO ProductFeatures (ProductId, Feature)
VALUES 
    (3, 'Hypoallergenic materials'),
    (3, 'Adjustable size'),
    (3, 'Tarnish resistant'),
    (3, 'Gift box included');

-- Insert gallery images for product 4
INSERT INTO GalleryImages (ProductId, ImageUrl)
VALUES 
    (4, 'https://via.placeholder.com/400?text=Sunglasses+1'),
    (4, 'https://via.placeholder.com/400?text=Sunglasses+2');

-- Insert colors for product 4
INSERT INTO ProductColors (ProductId, Color)
VALUES 
    (4, 'Black'),
    (4, 'Tortoise'),
    (4, 'Blue');

-- Insert tags for product 4
INSERT INTO ProductTags (ProductId, Tag)
VALUES 
    (4, 'Accessories'),
    (4, 'Summer'),
    (4, 'UV Protection');

-- Insert features for product 4
INSERT INTO ProductFeatures (ProductId, Feature)
VALUES 
    (4, 'UV400 protection'),
    (4, 'Polarized lenses'),
    (4, 'Lightweight frame'),
    (4, 'Includes case and cleaning cloth');

-- Insert gallery images for product 5
INSERT INTO GalleryImages (ProductId, ImageUrl)
VALUES 
    (5, 'https://via.placeholder.com/400?text=Watch+1'),
    (5, 'https://via.placeholder.com/400?text=Watch+2'),
    (5, 'https://via.placeholder.com/400?text=Watch+3');

-- Insert colors for product 5
INSERT INTO ProductColors (ProductId, Color)
VALUES 
    (5, 'Silver'),
    (5, 'Gold'),
    (5, 'Black');

-- Insert tags for product 5
INSERT INTO ProductTags (ProductId, Tag)
VALUES 
    (5, 'Watches'),
    (5, 'Luxury'),
    (5, 'Gift');

-- Insert features for product 5
INSERT INTO ProductFeatures (ProductId, Feature)
VALUES 
    (5, 'Japanese quartz movement'),
    (5, 'Water resistant to 50m'),
    (5, 'Scratch-resistant glass'),
    (5, '2-year warranty');