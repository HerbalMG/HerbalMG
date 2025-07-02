CREATE TABLE delivery_status (
    id SERIAL PRIMARY KEY,
    order_date DATE NOT NULL,
    delivery_date DATE,
    delivery_status TEXT[] NOT NULL, -- Array to track delivery stages (e.g., ['Ordered', 'Shipped', 'Delivered'])
    payment_type TEXT CHECK (payment_type IN ('Cash', 'Card', 'UPI', 'NetBanking', 'COD')) NOT NULL
);
