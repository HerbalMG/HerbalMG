const express = require('express');
const router = express.Router();
const sql = require('../config/supabase');

// Get all blogs
router.get('/', async (req, res) => {
  try {
    const blogs = await sql`SELECT * FROM blog ORDER BY created_at DESC`;
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get blog by ID
router.get('/:id', async (req, res) => {
  try {
    const [blog] = await sql`SELECT * FROM blog WHERE id = ${req.params.id}`;
    if (!blog) return res.status(404).json({ error: 'Not found' });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create blog
router.post('/', async (req, res) => {
  const { image_url, title, short_description, content, tags } = req.body;
  try {
    const [blog] = await sql`
      INSERT INTO blog (image_url, title, short_description, content, tags)
      VALUES (${image_url}, ${title}, ${short_description}, ${sql.json(content)}, ${tags})
      RETURNING *`;
    res.status(201).json(blog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update blog
router.put('/:id', async (req, res) => {
  const { image_url, title, short_description, content, tags } = req.body;
  try {
    const [blog] = await sql`
      UPDATE blog SET image_url=${image_url}, title=${title}, short_description=${short_description}, content=${sql.json(content)}, tags=${tags}, updated_at=NOW()
      WHERE id=${req.params.id} RETURNING *`;
    if (!blog) return res.status(404).json({ error: 'Not found' });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete blog
router.delete('/:id', async (req, res) => {
  try {
    const [blog] = await sql`DELETE FROM blog WHERE id=${req.params.id} RETURNING *`;
    if (!blog) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 