const express = require('express');
const router = express.Router();
const sql = require('../config/supabase');

// Get all banners
router.get('/', async (req, res) => {
  try {
    const banners = await sql`SELECT * FROM banner ORDER BY id DESC`;
    res.json(banners);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get banner by ID
router.get('/:id', async (req, res) => {
  try {
    const [banner] = await sql`SELECT * FROM banner WHERE id = ${req.params.id}`;
    if (!banner) return res.status(404).json({ error: 'Not found' });
    res.json(banner);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create banner
router.post('/', async (req, res) => {
  const { image_url } = req.body;
  try {
    const [banner] = await sql`
      INSERT INTO banner (image_url)
      VALUES (${image_url})
      RETURNING *`;
    res.status(201).json(banner);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update banner
router.put('/:id', async (req, res) => {
  const { image_url } = req.body;
  try {
    const [banner] = await sql`
      UPDATE banner SET image_url=${image_url}
      WHERE id=${req.params.id} RETURNING *`;
    if (!banner) return res.status(404).json({ error: 'Not found' });
    res.json(banner);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete banner
router.delete('/:id', async (req, res) => {
  try {
    const [banner] = await sql`DELETE FROM banner WHERE id=${req.params.id} RETURNING *`;
    if (!banner) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 