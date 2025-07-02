CREATE TABLE product_price (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES product(id) ON DELETE CASCADE,
    unit TEXT NOT NULL,  -- e.g., ml, g, tablet
    actual_price NUMERIC(10, 2) NOT NULL,
    discount_percent NUMERIC(5, 2),
    selling_price NUMERIC(10, 2) NOT NULL,
    quantity INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);
