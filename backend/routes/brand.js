const express = require('express');
const router = express.Router();
const sql = require('../config/supabase');

// Get all brands
router.get('/', async (req, res) => {
  try {
    const brands = await sql`SELECT * FROM brand ORDER BY id DESC`;
    res.json(brands);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get brand by ID
router.get('/:id', async (req, res) => {
  try {
    const [brand] = await sql`SELECT * FROM brand WHERE id = ${req.params.id}`;
    if (!brand) return res.status(404).json({ error: 'Not found' });
    res.json(brand);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create brand
router.post('/', async (req, res) => {
  const { name, image_url } = req.body;
  try {
    const [brand] = await sql`
      INSERT INTO brand (name, image_url)
      VALUES (${name}, ${image_url})
      RETURNING *`;
    res.status(201).json(brand);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Update brand
router.put('/:id', async (req, res) => {
  const { name, image_url } = req.body;
  try {
    const [brand] = await sql`
      UPDATE brand SET name=${name}, image_url=${image_url}
      WHERE id=${req.params.id} RETURNING *`;
    if (!brand) return res.status(404).json({ error: 'Not found' });
    res.json(brand);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete brand
router.delete('/:id', async (req, res) => {
  try {
    const [brand] = await sql`DELETE FROM brand WHERE id=${req.params.id} RETURNING *`;
    if (!brand) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 