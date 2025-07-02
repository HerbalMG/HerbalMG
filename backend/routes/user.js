const express = require('express');
const router = express.Router();
const sql = require('../config/supabase');

// Get all users
router.get('/', async (req, res) => {
  try {
    const users = await sql`SELECT * FROM app_user ORDER BY created_at DESC`;
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get user by ID
router.get('/:id', async (req, res) => {
  try {
    const [user] = await sql`SELECT * FROM app_user WHERE id = ${req.params.id}`;
    if (!user) return res.status(404).json({ error: 'Not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create user
router.post('/', async (req, res) => {
  const { name, email, phone_number, address, state, pin_code } = req.body;
  try {
    const [user] = await sql`
      INSERT INTO app_user (name, email, phone_number, address, state, pin_code)
      VALUES (${name}, ${email}, ${phone_number}, ${address}, ${state}, ${pin_code})
      RETURNING *`;
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update user
router.put('/:id', async (req, res) => {
  const { name, email, phone_number, address, state, pin_code } = req.body;
  try {
    const [user] = await sql`
      UPDATE app_user SET name=${name}, email=${email}, phone_number=${phone_number}, address=${address}, state=${state}, pin_code=${pin_code}
      WHERE id=${req.params.id} RETURNING *`;
    if (!user) return res.status(404).json({ error: 'Not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete user
router.delete('/:id', async (req, res) => {
  try {
    const [user] = await sql`DELETE FROM app_user WHERE id=${req.params.id} RETURNING *`;
    if (!user) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 