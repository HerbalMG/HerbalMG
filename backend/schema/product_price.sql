CREATE TABLE IF NOT EXISTS product_price (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES product(id) ON DELETE CASCADE,
    size VARCHAR(50),
    quantity INTEGER,
    actual_price NUMERIC(10,2),
    discount_percent NUMERIC(5,2),
    selling_price NUMERIC(10,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
); 