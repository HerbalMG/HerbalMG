CREATE TABLE app_user (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone_number VARCHAR(15) UNIQUE,
    address TEXT,
    state TEXT,
    pin_code VARCHAR(10),
    created_at TIMESTAMP DEFAULT NOW()
);
