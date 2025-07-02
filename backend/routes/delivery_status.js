const express = require('express');
const router = express.Router();
const sql = require('../config/supabase');

// Get all delivery statuses
router.get('/', async (req, res) => {
  try {
    const statuses = await sql`SELECT * FROM delivery_status ORDER BY order_date DESC`;
    res.json(statuses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get by ID
router.get('/:id', async (req, res) => {
  try {
    const [status] = await sql`SELECT * FROM delivery_status WHERE id = ${req.params.id}`;
    if (!status) return res.status(404).json({ error: 'Not found' });
    res.json(status);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create
router.post('/', async (req, res) => {
  const { order_date, delivery_date, delivery_status, payment_type } = req.body;
  try {
    const [status] = await sql`
      INSERT INTO delivery_status (order_date, delivery_date, delivery_status, payment_type)
      VALUES (${order_date}, ${delivery_date}, ${delivery_status}, ${payment_type})
      RETURNING *`;
    res.status(201).json(status);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update
router.put('/:id', async (req, res) => {
  const { order_date, delivery_date, delivery_status, payment_type } = req.body;
  try {
    const [status] = await sql`
      UPDATE delivery_status SET order_date=${order_date}, delivery_date=${delivery_date}, delivery_status=${delivery_status}, payment_type=${payment_type}
      WHERE id=${req.params.id} RETURNING *`;
    if (!status) return res.status(404).json({ error: 'Not found' });
    res.json(status);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete
router.delete('/:id', async (req, res) => {
  try {
    const [status] = await sql`DELETE FROM delivery_status WHERE id=${req.params.id} RETURNING *`;
    if (!status) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 