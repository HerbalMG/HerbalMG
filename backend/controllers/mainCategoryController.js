const sql = require('../config/supabase');
const { generateSlug, isNumericId } = require('../utils/slugUtils');
const { handleSlugConflictError } = require('../utils/errorHandlers');

async function getAllMainCategories(req, res) {
  try {
    const mainCategories = await sql`SELECT * FROM main_category ORDER BY id DESC`;
    res.json(mainCategories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getMainCategoryByIdOrSlug(req, res) {
  try {
    const identifier = req.params.identifier;
    let mainCategory;
    if (isNumericId(identifier)) {
      [mainCategory] = await sql`SELECT * FROM main_category WHERE id = ${identifier}`;
    } else {
      [mainCategory] = await sql`SELECT * FROM main_category WHERE slug = ${identifier}`;
    }
    if (!mainCategory) return res.status(404).json({ error: 'Main category not found' });
    res.json(mainCategory);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function createMainCategory(req, res) {
  const { name, slug } = req.body;
  try {
    const finalSlug = slug || generateSlug(name);
    const [mainCategory] = await sql`INSERT INTO main_category (name, slug) VALUES (${name}, ${finalSlug}) RETURNING *`;
    res.status(201).json(mainCategory);
  } catch (err) {
    handleSlugConflictError(err, res, 'A main category with this slug already exists. Please choose a different name or provide a custom slug.');
  }
}

async function updateMainCategory(req, res) {
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
    const [mainCategory] = await sql`
      UPDATE main_category SET name=${name}, slug=${finalSlug}, updated_at=NOW()
      WHERE ${whereClause}
      RETURNING *
    `;
    if (!mainCategory) return res.status(404).json({ error: 'Main category not found' });
    res.json(mainCategory);
  } catch (err) {
    handleSlugConflictError(err, res, 'A main category with this slug already exists. Please choose a different slug.');
  }
}

async function deleteMainCategory(req, res) {
  try {
    const identifier = req.params.identifier;
    let whereClause;
    if (isNumericId(identifier)) {
      whereClause = sql`id = ${identifier}`;
    } else {
      whereClause = sql`slug = ${identifier}`;
    }
    const [mainCategory] = await sql`DELETE FROM main_category WHERE ${whereClause} RETURNING *`;
    if (!mainCategory) return res.status(404).json({ error: 'Main category not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  getAllMainCategories,
  getMainCategoryByIdOrSlug,
  createMainCategory,
  updateMainCategory,
  deleteMainCategory,
};
