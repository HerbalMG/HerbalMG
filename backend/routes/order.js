const express = require('express');
const router = express.Router();
const sql = require('../config/supabase');

// Get all orders
router.get('/', async (req, res) => {
  try {
    const orders = await sql`SELECT * FROM orders ORDER BY order_date DESC`;
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get order by ID
router.get('/:id', async (req, res) => {
  try {
    const [order] = await sql`SELECT * FROM orders WHERE id = ${req.params.id}`;
    if (!order) return res.status(404).json({ error: 'Not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create order
router.post('/', async (req, res) => {
  const { product_name, quantity, ordered_by, is_prescription_required, payment_type, address, state, pin_code, status } = req.body;
  try {
    const [order] = await sql`
      INSERT INTO orders (product_name, quantity, ordered_by, is_prescription_required, payment_type, address, state, pin_code, status)
      VALUES (${product_name}, ${quantity}, ${ordered_by}, ${is_prescription_required}, ${payment_type}, ${address}, ${state}, ${pin_code}, ${status})
      RETURNING *`;
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update order
router.put('/:id', async (req, res) => {
  const { product_name, quantity, ordered_by, is_prescription_required, payment_type, address, state, pin_code, status } = req.body;
  try {
    const [order] = await sql`
      UPDATE orders SET product_name=${product_name}, quantity=${quantity}, ordered_by=${ordered_by}, is_prescription_required=${is_prescription_required}, payment_type=${payment_type}, address=${address}, state=${state}, pin_code=${pin_code}, status=${status}
      WHERE id=${req.params.id} RETURNING *`;
    if (!order) return res.status(404).json({ error: 'Not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete order
router.delete('/:id', async (req, res) => {
  try {
    const [order] = await sql`DELETE FROM orders WHERE id=${req.params.id} RETURNING *`;
    if (!order) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 