const sql = require('../config/supabase');

// Get all images
async function getAllImages(req, res) {
  try {
    const images = await sql`SELECT * FROM image ORDER BY id DESC`;
    res.json(images);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Get image by ID
async function getImageById(req, res) {
  try {
    const [image] = await sql`SELECT * FROM image WHERE id = ${req.params.id}`;
    if (!image) return res.status(404).json({ error: 'Not found' });
    res.json(image);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Create image
async function createImage(req, res) {
  const { product_id, url, alt_text } = req.body;
  try {
    const [image] = await sql`INSERT INTO image (product_id, url, alt_text) VALUES (${product_id}, ${url}, ${alt_text}) RETURNING *`;
    res.status(201).json(image);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Update image
async function updateImage(req, res) {
  const { product_id, url, alt_text } = req.body;
  try {
    const [image] = await sql`UPDATE image SET product_id=${product_id}, url=${url}, alt_text=${alt_text}, updated_at=NOW() WHERE id=${req.params.id} RETURNING *`;
    if (!image) return res.status(404).json({ error: 'Not found' });
    res.json(image);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Delete image
async function deleteImage(req, res) {
  try {
    const [deleted] = await sql`DELETE FROM image WHERE id=${req.params.id} RETURNING *`;
    if (!deleted) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  getAllImages,
  getImageById,
  createImage,
  updateImage,
  deleteImage,
};
