-- CREATE TABLE IF NOT EXISTS doctor_schedule (
--   id SERIAL PRIMARY KEY,
--   doctor_id INTEGER NOT NULL REFERENCES doctor(id) ON DELETE CASCADE,
--   day_of_week VARCHAR(10) NOT NULL CHECK (day_of_week IN (
--     'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
--   )),
--   morning_start_time TIME,
--   morning_end_time TIME,
--   evening_start_time TIME,
--   evening_end_time TIME,
--   UNIQUE (doctor_id, day_of_week)
-- );


-- CREATE TABLE IF NOT EXISTS doctor_schedule (
--   id SERIAL PRIMARY KEY,
--   doctor_id INTEGER NOT NULL REFERENCES doctor(id) ON DELETE CASCADE,
--   day_of_week VARCHAR(10) NOT NULL CHECK (
--     day_of_week IN ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday')
--   ),
--   morning_start_time TIME,
--   morning_end_time TIME,
--   evening_start_time TIME,
--   evening_end_time TIME,
--   UNIQUE (doctor_id, day_of_week)
-- );


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
