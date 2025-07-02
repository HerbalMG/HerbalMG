const express = require('express');
const router = express.Router();
const sql = require('../config/supabase');

// Get all product prices
router.get('/', async (req, res) => {
  try {
    const prices = await sql`SELECT * FROM product_price ORDER BY created_at DESC`;
    res.json(prices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get by ID
router.get('/:id', async (req, res) => {
  try {
    const [price] = await sql`SELECT * FROM product_price WHERE id = ${req.params.id}`;
    if (!price) return res.status(404).json({ error: 'Not found' });
    res.json(price);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create
router.post('/', async (req, res) => {
  const { product_id, unit, actual_price, discount_percent, selling_price, quantity } = req.body;
  try {
    const [price] = await sql`
      INSERT INTO product_price (product_id, unit, actual_price, discount_percent, selling_price, quantity)
      VALUES (${product_id}, ${unit}, ${actual_price}, ${discount_percent}, ${selling_price}, ${quantity})
      RETURNING *`;
    res.status(201).json(price);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update
router.put('/:id', async (req, res) => {
  const { product_id, unit, actual_price, discount_percent, selling_price, quantity } = req.body;
  try {
    const [price] = await sql`
      UPDATE product_price SET product_id=${product_id}, unit=${unit}, actual_price=${actual_price}, discount_percent=${discount_percent}, selling_price=${selling_price}, quantity=${quantity}
      WHERE id=${req.params.id} RETURNING *`;
    if (!price) return res.status(404).json({ error: 'Not found' });
    res.json(price);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete
router.delete('/:id', async (req, res) => {
  try {
    const [price] = await sql`DELETE FROM product_price WHERE id=${req.params.id} RETURNING *`;
    if (!price) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 