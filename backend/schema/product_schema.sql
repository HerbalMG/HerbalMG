CREATE TABLE product (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT CHECK (category IN ('Ayurvedic', 'Unani', 'Homeopathic')),
    medicine_type TEXT CHECK (medicine_type IN ('Tablet', 'Syrup', 'Powder')),
    images TEXT[],  -- Array of image URLs or paths
    brand TEXT[],
    reference_books TEXT[],  -- Array of book names
    dosage_information TEXT,
    cause TEXT,
    description TEXT,
    key_ingredients TEXT,
    uses_indications TEXT,
    actual_price NUMERIC(10, 2) NOT NULL,
    selling_price NUMERIC(10, 2) NOT NULL,
    discount_percent NUMERIC(5, 2),
    gst INTEGER CHECK (gst IN (0, 5, 12, 18)),
    total_quantity INTEGER NOT NULL,
    prescription_required BOOLEAN DEFAULT FALSE
);

-- 🔍 Indexes for search performance

-- Index for fast name-based searching (e.g., product name search)
CREATE INDEX idx_product_name ON product (name);

-- Index for category filtering
CREATE INDEX idx_product_category ON product (category);

-- Index for medicine type filtering
CREATE INDEX idx_product_medicine_type ON product (medicine_type);

-- Index for brand searches
CREATE INDEX idx_product_brand ON product (brand);

-- Index for price range queries
CREATE INDEX idx_product_selling_price ON product (selling_price);

-- Index for availability or stock filtering
CREATE INDEX idx_product_total_quantity ON product (total_quantity);

-- Index for prescription filter
CREATE INDEX idx_product_prescription_required ON product (prescription_required);
