const express = require('express');
const router = express.Router();
const sql = require('../config/supabase');

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await sql`SELECT * FROM product ORDER BY id DESC`;
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get product by ID
router.get('/:id', async (req, res) => {
  try {
    const [product] = await sql`SELECT * FROM product WHERE id = ${req.params.id}`;
    if (!product) return res.status(404).json({ error: 'Not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create product
router.post('/', async (req, res) => {
  const { name, category, medicine_type, images, brand, reference_books, dosage_information, cause, description, key_ingredients, uses_indications, actual_price, selling_price, discount_percent, gst, total_quantity, prescription_required } = req.body;
  try {
    const [product] = await sql`
      INSERT INTO product (name, category, medicine_type, images, brand, reference_books, dosage_information, cause, description, key_ingredients, uses_indications, actual_price, selling_price, discount_percent, gst, total_quantity, prescription_required)
      VALUES (${name}, ${category}, ${medicine_type}, ${images}, ${brand}, ${reference_books}, ${dosage_information}, ${cause}, ${description}, ${key_ingredients}, ${uses_indications}, ${actual_price}, ${selling_price}, ${discount_percent}, ${gst}, ${total_quantity}, ${prescription_required})
      RETURNING *`;
    res.status(201).json(product);
  } catch (err) {
    console.error('Error creating product:', err);
    res.status(500).json({ error: err.message });
  }
});

// Update product
router.put('/:id', async (req, res) => {
  const { name, category, medicine_type, images, brand, reference_books, dosage_information, cause, description, key_ingredients, uses_indications, actual_price, selling_price, discount_percent, gst, total_quantity, prescription_required } = req.body;
  try {
    const [product] = await sql`
      UPDATE product SET name=${name}, category=${category}, medicine_type=${medicine_type}, images=${images}, brand=${brand}, reference_books=${reference_books}, dosage_information=${dosage_information}, cause=${cause}, description=${description}, key_ingredients=${key_ingredients}, uses_indications=${uses_indications}, actual_price=${actual_price}, selling_price=${selling_price}, discount_percent=${discount_percent}, gst=${gst}, total_quantity=${total_quantity}, prescription_required=${prescription_required}
      WHERE id=${req.params.id} RETURNING *`;
    if (!product) return res.status(404).json({ error: 'Not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete product
router.delete('/:id', async (req, res) => {
  try {
    const [product] = await sql`DELETE FROM product WHERE id=${req.params.id} RETURNING *`;
    if (!product) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 