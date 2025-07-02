CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    product_name TEXT NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    order_date TIMESTAMP DEFAULT NOW(),
    ordered_by INTEGER REFERENCES app_user(id) ON DELETE SET NULL,
    is_prescription_required BOOLEAN DEFAULT FALSE,
    payment_type TEXT CHECK (payment_type IN ('Cash', 'Card', 'UPI', 'NetBanking', 'COD')) NOT NULL,
    address TEXT NOT NULL,
    state TEXT,
    pin_code VARCHAR(10),
    status TEXT DEFAULT 'Pending'  -- e.g., Pending, Shipped, Delivered, Cancelled
);
