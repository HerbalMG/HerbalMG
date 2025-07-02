CREATE TABLE brand (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    image_url TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
);
