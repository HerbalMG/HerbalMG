const express = require('express');
const router = express.Router();
const sql = require('../config/supabase');

// Get all books
router.get('/', async (req, res) => {
  try {
    const books = await sql`SELECT * FROM book ORDER BY id DESC`;
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get book by ID
router.get('/:id', async (req, res) => {
  try {
    const [book] = await sql`SELECT * FROM book WHERE id = ${req.params.id}`;
    if (!book) return res.status(404).json({ error: 'Not found' });
    res.json(book);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create book
router.post('/', async (req, res) => {
  const { name } = req.body;
  try {
    const [book] = await sql`
      INSERT INTO book (name)
      VALUES (${name})
      RETURNING *`;
    res.status(201).json(book);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update book
router.put('/:id', async (req, res) => {
  const { name } = req.body;
  try {
    const [book] = await sql`
      UPDATE book SET name=${name}
      WHERE id=${req.params.id} RETURNING *`;
    if (!book) return res.status(404).json({ error: 'Not found' });
    res.json(book);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete book
router.delete('/:id', async (req, res) => {
  try {
    const [book] = await sql`DELETE FROM book WHERE id=${req.params.id} RETURNING *`;
    if (!book) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 