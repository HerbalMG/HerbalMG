const express = require('express');
const router = express.Router();
const sql = require('../config/supabase');

// Get all doctors
router.get('/', async (req, res) => {
  try {
    const doctors = await sql`SELECT * FROM doctor ORDER BY id DESC`;
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get doctor by ID
router.get('/:id', async (req, res) => {
  try {
    const [doctor] = await sql`SELECT * FROM doctor WHERE id = ${req.params.id}`;
    if (!doctor) return res.status(404).json({ error: 'Not found' });
    res.json(doctor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create doctor
router.post('/', async (req, res) => {
  const { image_url, name, phone_number, degree, address, city, state, pincode, start_time, end_time, specialization } = req.body;
  try {
    const [doctor] = await sql`
      INSERT INTO doctor (image_url, name, phone_number, degree, address, city, state, pincode, start_time, end_time, specialization)
      VALUES (${image_url}, ${name}, ${phone_number}, ${degree}, ${address}, ${city}, ${state}, ${pincode}, ${start_time}, ${end_time}, ${specialization})
      RETURNING *`;
    res.status(201).json(doctor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update doctor
router.put('/:id', async (req, res) => {
  const { image_url, name, phone_number, degree, address, city, state, pincode, start_time, end_time, specialization } = req.body;
  try {
    const [doctor] = await sql`
      UPDATE doctor SET image_url=${image_url}, name=${name}, phone_number=${phone_number}, degree=${degree}, address=${address}, city=${city}, state=${state}, pincode=${pincode}, start_time=${start_time}, end_time=${end_time}, specialization=${specialization}
      WHERE id=${req.params.id} RETURNING *`;
    if (!doctor) return res.status(404).json({ error: 'Not found' });
    res.json(doctor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete doctor
router.delete('/:id', async (req, res) => {
  try {
    const [doctor] = await sql`DELETE FROM doctor WHERE id=${req.params.id} RETURNING *`;
    if (!doctor) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 