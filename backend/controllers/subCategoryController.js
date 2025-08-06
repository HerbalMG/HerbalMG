const sql = require('../config/supabase');
const { generateSlug, isNumericId } = require('../utils/slugUtils');

// Get all sub-categories
exports.getAll = async (req, res) => {
  try {
    const subCategories = await sql`SELECT * FROM sub_category ORDER BY id DESC`;
    res.json(subCategories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get sub-category by ID or slug
exports.getByIdOrSlug = async (req, res) => {
  try {
    const identifier = req.params.identifier;
    let subCategory;

    if (isNumericId(identifier)) {
      [subCategory] = await sql`SELECT * FROM sub_category WHERE id = ${identifier}`;
    } else {
      [subCategory] = await sql`SELECT * FROM sub_category WHERE slug = ${identifier}`;
    }

    if (!subCategory) {
      return res.status(404).json({ error: 'Sub category not found' });
    }

    res.json(subCategory);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create sub-category
exports.create = async (req, res) => {
  const { name, slug } = req.body;
  try {
    const finalSlug = slug || generateSlug(name);
    const [subCategory] = await sql`
      INSERT INTO sub_category (name, slug)
      VALUES (${name}, ${finalSlug})
      RETURNING *`;
    res.status(201).json(subCategory);
  } catch (err) {
    if (err.message.includes('duplicate key value') && err.message.includes('slug')) {
      res.status(400).json({ error: 'A sub category with this slug already exists. Choose another.' });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
};

// Update sub-category
exports.update = async (req, res) => {
  const { name, slug } = req.body;
  try {
    const identifier = req.params.identifier;
    const finalSlug = slug || generateSlug(name);
    let whereClause;

    if (isNumericId(identifier)) {
      whereClause = sql`id = ${identifier}`;
    } else {
      whereClause = sql`slug = ${identifier}`;
    }

    const [subCategory] = await sql`
      UPDATE sub_category
      SET name = ${name}, slug = ${finalSlug}, updated_at = NOW()
      WHERE ${whereClause}
      RETURNING *`;

    if (!subCategory) {
      return res.status(404).json({ error: 'Sub category not found' });
    }

    res.json(subCategory);
  } catch (err) {
    if (err.message.includes('duplicate key value') && err.message.includes('slug')) {
      res.status(400).json({ error: 'Slug already exists. Please use a different one.' });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
};

// Delete sub-category
exports.remove = async (req, res) => {
  try {
    const identifier = req.params.identifier;
    let whereClause;

    if (isNumericId(identifier)) {
      whereClause = sql`id = ${identifier}`;
    } else {
      whereClause = sql`slug = ${identifier}`;
    }

    const [subCategory] = await sql`
      DELETE FROM sub_category WHERE ${whereClause} RETURNING *`;

    if (!subCategory) {
      return res.status(404).json({ error: 'Sub category not found' });
    }

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
