-- CREATE TABLE IF NOT EXISTS doctor (
--     id SERIAL PRIMARY KEY,
--     name TEXT NOT NULL,
--     specialization VARCHAR(100) NOT NULL,
--     phone_number VARCHAR(20) NOT NULL UNIQUE,
--     degree TEXT NOT NULL,
--     image_url TEXT,
--     city TEXT NOT NULL,
--     state TEXT NOT NULL,
--     pincode VARCHAR(6) NOT NULL,
--     address TEXT NOT NULL,

--     morning_start_time TIME NOT NULL,
--     morning_end_time TIME NOT NULL,
--     evening_start_time TIME NOT NULL,
--     evening_end_time TIME NOT NULL,

--     rating NUMERIC(2,1) DEFAULT 0.0 CHECK (rating >= 0 AND rating <= 5),
--     is_available BOOLEAN DEFAULT TRUE,

--     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
--     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
-- );




-- CREATE TABLE IF NOT EXISTS doctor (
--   id SERIAL PRIMARY KEY,
--   name TEXT NOT NULL,
--   specialization VARCHAR(100) NOT NULL,
--   phone_number VARCHAR(20) NOT NULL UNIQUE,
--   degree TEXT NOT NULL,
--   image_url TEXT,
--   city TEXT NOT NULL,
--   state TEXT NOT NULL,
--   pincode VARCHAR(6) NOT NULL,
--   address TEXT NOT NULL,
--   rating NUMERIC(2,1) DEFAULT 0.0 CHECK (rating >= 0 AND rating <= 5),
--   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
--   updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
-- );


-- Create doctor table
CREATE TABLE IF NOT EXISTS doctor (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  specialization VARCHAR(100) NOT NULL,
  phone_number VARCHAR(20) NOT NULL UNIQUE,
  degree TEXT NOT NULL,
  image_url TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  pincode VARCHAR(6) NOT NULL CHECK (pincode ~ '^\d{6}$'),
  address TEXT NOT NULL,
  rating NUMERIC(2,1) DEFAULT 0.0 CHECK (rating >= 0 AND rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create doctor_schedule table
CREATE TABLE IF NOT EXISTS doctor_schedule (
  id SERIAL PRIMARY KEY,
  doctor_id INTEGER NOT NULL REFERENCES doctor(id) ON DELETE CASCADE,
  day_of_week VARCHAR(10) NOT NULL CHECK (
    day_of_week IN ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday')
  ),
  morning_start_time TIME,
  morning_end_time TIME,
  evening_start_time TIME,
  evening_end_time TIME,
  UNIQUE (doctor_id, day_of_week)
);

-- Index for faster joins
CREATE INDEX IF NOT EXISTS idx_doctor_schedule_doctor_id ON doctor_schedule(doctor_id);
