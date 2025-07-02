CREATE TABLE doctor (
    id SERIAL PRIMARY KEY,
    image_url TEXT,
    name TEXT NOT NULL,
    phone_number VARCHAR(15) NOT NULL,
    degree TEXT,
    address TEXT,
    city TEXT,
    state TEXT,
    pincode VARCHAR(10),
    start_time TIME,
    end_time TIME,
    specialization TEXT
);
