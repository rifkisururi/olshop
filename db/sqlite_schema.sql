-- Products table
CREATE TABLE IF NOT EXISTS Products (
    Id INTEGER PRIMARY KEY AUTOINCREMENT,
    Name TEXT,
    Category TEXT,
    Price DECIMAL(10, 2) NOT NULL,
    OldPrice DECIMAL(10, 2),
    Description TEXT,
    Material TEXT,
    Dimensions TEXT,
    Weight INTEGER NOT NULL,
    Rating REAL NOT NULL,
    ReviewCount INTEGER NOT NULL,
    ImageUrl TEXT,
    IsFeatured INTEGER NOT NULL,
    IsBestSeller INTEGER NOT NULL,
    Status TEXT
);

-- GalleryImages table
CREATE TABLE IF NOT EXISTS GalleryImages (
    Id INTEGER PRIMARY KEY AUTOINCREMENT,
    ProductId INTEGER NOT NULL,
    ImageUrl TEXT NOT NULL,
    FOREIGN KEY (ProductId) REFERENCES Products(Id) ON DELETE CASCADE
);

-- ProductColors table
CREATE TABLE IF NOT EXISTS ProductColors (
    Id INTEGER PRIMARY KEY AUTOINCREMENT,
    ProductId INTEGER NOT NULL,
    Color TEXT NOT NULL,
    FOREIGN KEY (ProductId) REFERENCES Products(Id) ON DELETE CASCADE
);

-- ProductTags table
CREATE TABLE IF NOT EXISTS ProductTags (
    Id INTEGER PRIMARY KEY AUTOINCREMENT,
    ProductId INTEGER NOT NULL,
    Tag TEXT NOT NULL,
    FOREIGN KEY (ProductId) REFERENCES Products(Id) ON DELETE CASCADE
);

-- ProductFeatures table
CREATE TABLE IF NOT EXISTS ProductFeatures (
    Id INTEGER PRIMARY KEY AUTOINCREMENT,
    ProductId INTEGER NOT NULL,
    Feature TEXT NOT NULL,
    FOREIGN KEY (ProductId) REFERENCES Products(Id) ON DELETE CASCADE
);