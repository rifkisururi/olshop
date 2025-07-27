-- Products table
CREATE TABLE IF NOT EXISTS Products (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(255),
    Category VARCHAR(100),
    Price DECIMAL(10, 2) NOT NULL,
    OldPrice DECIMAL(10, 2),
    Description TEXT,
    Material VARCHAR(255),
    Dimensions VARCHAR(100),
    Weight INT NOT NULL,
    Rating DOUBLE NOT NULL,
    ReviewCount INT NOT NULL,
    ImageUrl VARCHAR(255),
    IsFeatured BOOLEAN NOT NULL,
    IsBestSeller BOOLEAN NOT NULL,
    Status VARCHAR(50)
);

-- GalleryImages table
CREATE TABLE IF NOT EXISTS GalleryImages (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    ProductId INT NOT NULL,
    ImageUrl VARCHAR(255) NOT NULL,
    FOREIGN KEY (ProductId) REFERENCES Products(Id) ON DELETE CASCADE
);

-- ProductColors table
CREATE TABLE IF NOT EXISTS ProductColors (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    ProductId INT NOT NULL,
    Color VARCHAR(50) NOT NULL,
    FOREIGN KEY (ProductId) REFERENCES Products(Id) ON DELETE CASCADE
);

-- ProductTags table
CREATE TABLE IF NOT EXISTS ProductTags (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    ProductId INT NOT NULL,
    Tag VARCHAR(50) NOT NULL,
    FOREIGN KEY (ProductId) REFERENCES Products(Id) ON DELETE CASCADE
);

-- ProductFeatures table
CREATE TABLE IF NOT EXISTS ProductFeatures (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    ProductId INT NOT NULL,
    Feature VARCHAR(255) NOT NULL,
    FOREIGN KEY (ProductId) REFERENCES Products(Id) ON DELETE CASCADE
);